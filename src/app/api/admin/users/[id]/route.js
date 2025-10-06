import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import User from '../../../../../../models/Users';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      dob, 
      gender, 
      image, 
      role, 
      addresses, 
      paymentMethods 
    } = body;

    // Build update object with only provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob;
    if (gender !== undefined) updateData.gender = gender;
    if (image !== undefined) updateData.image = image;
    if (role !== undefined) updateData.role = role;
    if (addresses !== undefined) {
      // Validate addresses if provided
      for (const address of addresses) {
        if (!address.line1 || !address.city || !address.state || !address.zip) {
          return NextResponse.json(
            { success: false, message: 'Address must include line1, city, state, and zip' },
            { status: 400 }
          );
        }
      }
      updateData.addresses = addresses;
    }
    if (paymentMethods !== undefined) {
      // Validate payment methods if provided
      for (const payment of paymentMethods) {
        if (!payment.cardType || !payment.last4 || !payment.expiry) {
          return NextResponse.json(
            { success: false, message: 'Payment method must include cardType, last4, and expiry' },
            { status: 400 }
          );
        }
      }
      updateData.paymentMethods = paymentMethods;
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}