import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET single project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = 'SELECT * FROM projects WHERE id = ?';
    const projects = await query(sql, [id]) as any[];
    
    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const project = projects[0];
    // Parse JSON fields
    const parsedProject = {
      ...project,
      highlights: project.highlights ? JSON.parse(project.highlights as string) : [],
      tags: project.tags ? JSON.parse(project.tags as string) : [],
    };
    
    return NextResponse.json(parsedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, location, description, image, highlights, tags, year } = body;
    
    const sql = `
      UPDATE projects 
      SET title = ?, category = ?, location = ?, description = ?, image = ?, highlights = ?, tags = ?, year = ?
      WHERE id = ?
    `;
    
    const queryParams = [
      title,
      category,
      location,
      description,
      image,
      JSON.stringify(highlights || []),
      JSON.stringify(tags || []),
      year,
      id,
    ];
    
    await query(sql, queryParams);
    
    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = 'DELETE FROM projects WHERE id = ?';
    await query(sql, [id]);
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
