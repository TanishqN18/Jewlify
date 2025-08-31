// src/app/api/metal-prices/route.js

export async function GET(req) {
  try {
    const rapidHeaders = {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'live-metal-prices.p.rapidapi.com',
    };

    // Fetch latest metal prices from RapidAPI (XAU, XAG in INR)
    const res = await fetch('https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAG?currency=INR', {
      headers: rapidHeaders,
      cache: 'no-store',
    });

    const data = await res.json();

    if (!data?.rates?.XAU || !data?.rates?.XAG) {
      throw new Error('Missing gold or silver rates');
    }

    // Convert 1 oz to grams and calculate prices
    const goldPerGram24K = data.rates.XAU / 31.1035;
    const goldPerGram22K = goldPerGram24K * 0.916;
    const silverPerGram = data.rates.XAG / 31.1035;

    // Fetch diamond (optional / placeholder)
    const diamondRes = await fetch('https://data.openfacet.net/index.json');
    const diamondData = await diamondRes.json();

    return new Response(
      JSON.stringify({
        mcx: {
          gold_24K_10g: (goldPerGram24K * 10).toFixed(2),
          gold_22K_10g: (goldPerGram22K * 10).toFixed(2),
          silver_1kg: (silverPerGram * 1000).toFixed(2),
        },
        diamond: diamondData?.dcx || null,
        lastUpdated: new Date().toISOString(),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Metal Price API Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch prices' }), {
      status: 500,
    });
  }
}
