import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const owner = 'vadymuxd'; // Replace with your GitHub username
    const repo = 'design-validate-r5-nextjs'; // Replace with your repository name
    
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'design-validate-app',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('GitHub API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch last commit: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('GitHub API Response:', JSON.stringify(data, null, 2));
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No commits found in the repository');
    }

    const [lastCommit] = data;
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
