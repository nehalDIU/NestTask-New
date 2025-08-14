import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { signupSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    
    // Validate request data
    const validatedData = signupSchema.parse(body)

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: validatedData.email,
          name: validatedData.name,
          student_id: validatedData.student_id,
          department_id: validatedData.department_id,
          batch_id: validatedData.batch_id,
          section_id: validatedData.section_id,
          role: 'user', // Default role
        })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Account created successfully',
        user: authData.user 
      })
    }

    return NextResponse.json({ error: 'Failed to create account' }, { status: 400 })

  } catch (error: any) {
    console.error('Error in signup:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
