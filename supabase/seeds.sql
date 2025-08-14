-- NestTask Seed Data
-- Insert initial data for departments, batches, and sections

-- Insert departments
INSERT INTO departments (name) VALUES
    ('Computer Science and Engineering (CSE)'),
    ('Software Engineering (SWE)'),
    ('Multimedia and Creative Technology (MCT)'),
    ('Computing and Information Systems (CIS)'),
    ('Information Technology and Management (ITM)');

-- Insert batches for each department (Batch 50 to Batch 70)
DO $$
DECLARE
    dept_record RECORD;
    batch_num INTEGER;
BEGIN
    FOR dept_record IN SELECT id FROM departments LOOP
        FOR batch_num IN 50..70 LOOP
            INSERT INTO batches (name, department_id) 
            VALUES ('Batch ' || batch_num, dept_record.id);
        END LOOP;
    END LOOP;
END $$;

-- Insert sections for each batch (Section A to Section Z)
DO $$
DECLARE
    batch_record RECORD;
    section_char CHAR(1);
BEGIN
    FOR batch_record IN SELECT id FROM batches LOOP
        FOR section_char IN SELECT chr(i) FROM generate_series(65, 90) AS i LOOP
            INSERT INTO sections (name, batch_id) 
            VALUES ('Section ' || section_char, batch_record.id);
        END LOOP;
    END LOOP;
END $$;
