import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserIdFromRequest } from '@/lib/auth';

import getFarmerProfileModel from '@/models/FarmerProfile';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const Model = await getFarmerProfileModel();
    const docs = await Model.find({ user_id: userId });
    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const Model = await getFarmerProfileModel();
    const doc = await Model.create({ ...body, user_id: userId });
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getCurrentUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, user_id: _userId, ...update } = body;
    const Model = await getFarmerProfileModel();
    const doc = await Model.findOneAndUpdate({ _id: id, user_id: userId }, update, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getCurrentUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const Model = await getFarmerProfileModel();
    await Model.findOneAndDelete({ _id: id, user_id: userId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
