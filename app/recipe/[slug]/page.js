// Required imports for handling markdown content, file operations and metadata
import Markdown from "markdown-to-jsx" // Converts markdown to JSX for rendering
import getPostMetadata from "@/utils/getPostMetadata" // Custom utility to get post metadata
import React from 'react'
import fs from 'fs' // Node.js file system module
import matter from "gray-matter" // Parses front-matter from markdown files

/**
 * Retrieves the content of a markdown file for a specific recipe
 * @param {string} slug - The unique identifier for the recipe
 * @returns {Object} - The parsed markdown content including frontmatter
 */

// Function to get the content of a markdown file for a specific recipe 
function getPostContent(slug) {
    // Define the folder where recipe markdown files are stored
    const folder = 'recipes/'
    // Construct the full file path
    const file = folder + `${slug}.md`
    // Read the markdown file contents
    const content = fs.readFileSync(file, 'utf8')

    // Parse the markdown content and frontmatter
    const matterResult = matter(content)
    return matterResult
}

/**
 * Generates static parameters for all recipe pages at build time
 * This is used by Next.js for static site generation (SSG)
 * @returns {Array<Object>} Array of objects containing slug parameters
 */

// Function to generate static parameters for all recipe pages at build time    
export const generateStaticParams = async () => {
    // Get all recipe metadata  
    const posts = getPostMetadata('recipes')
    // Map each recipe to a page with a slug parameter
    return posts.map((post) => ({ slug: post.slug }))
}

/**
 * Generates metadata for each recipe page
 * Used by Next.js for SEO and page titles
 * @param {Object} params - Route parameters including slug
 * @param {Object} searchParams - URL search parameters (not used)
 * @returns {Object} Metadata object with page title
 */
export async function generateMetadata({ params, searchParams }) {
    // Create page title using the slug, replacing underscores with spaces
    const id = params?.slug ? ' ⋅ ' + params?.slug : ''
    return {
        title: `The Bubbly Baker ${id.replaceAll('_', ' ')}`
    }
}

/**
 * Main recipe page component
 * Renders a single recipe's content from markdown
 * @param {Object} props - Component props including route parameters
 * @returns {JSX.Element} Rendered recipe page
 */
export default function RecipePage(props) {
    // Get the recipe slug from the URL parameters
    const slug = props.params.slug
    // Fetch the recipe content using the slug
    const post = getPostContent(slug)
    console.log(post)
    
    return (
        <main>
            <article>
                {/* Convert markdown content to JSX and render it */}
                <Markdown>{post.content}</Markdown>
            </article>
        </main>
    )
}