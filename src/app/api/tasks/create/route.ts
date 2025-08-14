import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createTaskSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check role
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role, section_id')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check if user can create tasks
    if (userProfile.role === 'user') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate request data
    const validatedData = createTaskSchema.parse({
      ...body,
      section_id: userProfile.section_id
    })

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        due_date: validatedData.due_date,
        category: validatedData.category,
        section_id: validatedData.section_id,
        created_by: user.id,
        files: validatedData.files || []
      })
      .select()
      .single()

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 400 })
    }

    // Create user_tasks entries for all students in the section
    const { data: students } = await supabase
      .from('users')
      .select('id')
      .eq('section_id', validatedData.section_id)
      .eq('role', 'user')

    if (students && students.length > 0) {
      const userTasks = students.map(student => ({
        user_id: student.id,
        task_id: task.id,
        status: 'pending' as const
      }))

      const { error: userTasksError } = await supabase
        .from('user_tasks')
        .insert(userTasks)

      if (userTasksError) {
        console.error('Error creating user tasks:', userTasksError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ success: true, data: task })

  } catch (error: any) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
