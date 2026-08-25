import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET all projects
export async function GET() {
  try {
    const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
    const projects = await query(sql) as any[];
    
    // Parse JSON fields
    const parsedProjects = projects.map(project => ({
      ...project,
      highlights: project.highlights ? JSON.parse(project.highlights as string) : [],
      tags: project.tags ? JSON.parse(project.tags as string) : [],
    }));
    
    return NextResponse.json(parsedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, location, description, image, highlights, tags, year } = body;
    
    const sql = `
      INSERT INTO projects (title, category, location, description, image, highlights, tags, year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      title,
      category,
      location,
      description,
      image,
      JSON.stringify(highlights || []),
      JSON.stringify(tags || []),
      year,
    ];
    
    await query(sql, params);
    
    return NextResponse.json({ message: 'Project created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
