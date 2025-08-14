export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      batches: {
        Row: {
          id: string
          name: string
          department_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          department_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          department_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          id: string
          name: string
          batch_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          batch_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          batch_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'section_admin' | 'super_admin'
          student_id: string | null
          department_id: string | null
          batch_id: string | null
          section_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'user' | 'section_admin' | 'super_admin'
          student_id?: string | null
          department_id?: string | null
          batch_id?: string | null
          section_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'section_admin' | 'super_admin'
          student_id?: string | null
          department_id?: string | null
          batch_id?: string | null
          section_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          files: Json
          due_date: string | null
          category: string
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          section_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          files?: Json
          due_date?: string | null
          category?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          section_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          files?: Json
          due_date?: string | null
          category?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          section_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          status: 'pending' | 'completed'
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          status?: 'pending' | 'completed'
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          status?: 'pending' | 'completed'
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
