"use client";

export default function Wishlist() {
  const wishlistItems = [
    {
      id: 1,
      name: "Diamond Tennis Bracelet",
      price: "$2,450",
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/5a02b14769-3d872c2d598b64a5b506.png",
    },
    {
      id: 2,
      name: "Gold Pendant Necklace",
      price: "$1,890",
      image:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfb11ef58-40550fc84eba1dfe9682.png",
    },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden glass-effect group hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white">
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {item.price}
              </p>
              <button className="w-full px-4 py-3 bg-gold-gradient text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <i className="fa-solid fa-shopping-cart mr-2"></i>Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
