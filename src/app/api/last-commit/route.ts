import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const owner = 'vadimsherbakov'; // Replace with your GitHub username
    const repo = 'design-validate-r5-nextjs'; // Replace with your repository name
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch last commit');
    }

    const [lastCommit] = await response.json();
    const lastCommitDate = lastCommit?.commit?.author?.date;

    return NextResponse.json({ lastCommitDate });
  } catch (error) {
    console.error('Error fetching last commit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last commit date' },
      { status: 500 }
    );
  }
}
