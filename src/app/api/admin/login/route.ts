import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Validation
    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    // Connect to the actual backend API
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Login failed' },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        data: data.data
      });

    } catch (apiError) {
      console.error('Backend API error:', apiError);
      
      // Fallback to mock admin for development if backend is unavailable
      const validAdmins = [
        {
          email: 'admin@doorbel.org',
          phone: '+233241234567',
          password: 'admin123',
          admin: {
            _id: 'admin_001',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@doorbel.org',
            phone: '+233241234567',
            type: 'admin',
            isVerified: true,
            isActive: true,
          }
        }
      ];

      const admin = validAdmins.find(a => 
        a.email === identifier || a.phone === identifier
      );

      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const tokens = {
        accessToken: `admin_token_${Date.now()}`,
        refreshToken: `admin_refresh_${Date.now()}`,
        tokenFamily: `family_${Date.now()}`,
        accessTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: 'Admin login successful (fallback mode)',
        data: {
          admin: admin.admin,
          tokens
        }
      });
    }

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
