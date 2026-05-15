import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// POST: Create session cookie from ID token
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // If Firebase Admin isn't set up, just blindly accept the token for local development
    if (!adminAuth) {
      console.warn('Bypassing Firebase Admin auth check (Dev Mode / Missing Env)');
      const response = NextResponse.json({ status: 'success', warning: 'Admin SDK missing, using raw token' });
      response.cookies.set('__session', idToken, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        path: '/',
      });
      return response;
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // Check if user is in authorized admins list
    const adminDoc = await adminDb.collection('admin').doc('authorizedUsers').collection('items').where('email', '==', email).get();

    if (adminDoc.empty) {
      return NextResponse.json({ error: 'Unauthorized: Not an admin' }, { status: 403 });
    }

    // Create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Log admin session
    await adminDb.collection('admin').doc('sessions').collection('items').add({
      email,
      uid,
      timestamp: new Date(),
      isActive: true,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      browser: request.headers.get('user-agent') || 'unknown',
      country: 'Unknown',
    });

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET: Verify session cookie
export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('__session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    // If Firebase Admin isn't set up, assume valid for local dev
    if (!adminAuth) {
      return NextResponse.json({ status: 'authenticated' });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    return NextResponse.json({
      status: 'authenticated',
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
