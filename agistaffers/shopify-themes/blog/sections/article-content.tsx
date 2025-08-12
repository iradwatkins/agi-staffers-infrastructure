'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  User, 
  BookOpen, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Bookmark
} from 'lucide-react'

export default function ArticleContentSection({ section, settings }: SectionProps) {
  const {
    show_article_meta = true,
    show_social_sharing = true,
    show_author_bio = true,
    show_related_articles = true,
    show_navigation = true,
    article = {
      title: 'The Complete Guide to Content Marketing in 2024',
      content: `
        <p>Content marketing has evolved significantly over the past decade, and 2024 brings new challenges and opportunities. In this comprehensive guide, we'll explore the strategies that successful brands are using to engage their audiences and drive meaningful results.</p>
        
        <h2>Why Content Marketing Matters More Than Ever</h2>
        <p>Today's consumers are bombarded with information from countless sources. Standing out requires more than just creating content—it demands strategic thinking, authentic storytelling, and a deep understanding of your audience's needs.</p>
        
        <h3>Key Statistics</h3>
        <ul>
          <li>70% of marketers actively invest in content marketing</li>
          <li>Content marketing costs 62% less than traditional marketing</li>
          <li>91% of B2B marketers use content marketing to reach customers</li>
        </ul>
        
        <h2>Building Your Content Strategy</h2>
        <p>A successful content marketing strategy starts with understanding your audience. Here's how to build a framework that drives results:</p>
        
        <h3>1. Define Your Goals</h3>
        <p>Before creating any content, establish clear, measurable objectives. Are you looking to increase brand awareness, generate leads, or establish thought leadership?</p>
        
        <h3>2. Know Your Audience</h3>
        <p>Develop detailed buyer personas that include demographics, pain points, content preferences, and buying behaviors.</p>
        
        <h3>3. Create a Content Calendar</h3>
        <p>Plan your content in advance to ensure consistency and strategic alignment with business goals and seasonal trends.</p>
      `,
      author: {
        name: 'Sarah Johnson',
        bio: 'Sarah is a digital marketing strategist with over 10 years of experience helping businesses grow through content marketing. She\'s worked with Fortune 500 companies and startups alike.',
        image: '/api/placeholder/120/120',
        social: {
          twitter: '@sarahjohnson',
          linkedin: '/in/sarahjohnson'
        }
      },
      meta: {
        date: '2024-01-15',
        read_time: '12 min read',
        category: 'Content Marketing',
        tags: ['Marketing', 'Strategy', 'Content', '2024'],
        views: '2,847',
        likes: 156,
        comments: 23
      }
    },
    navigation = {
      previous: {
        title: 'SEO Strategies That Actually Work',
        url: '/blog/seo-strategies-2024'
      },
      next: {
        title: 'Building High-Converting Landing Pages',
        url: '/blog/landing-page-optimization'
      }
    },
    related_articles = [
      {
        title: 'Digital Marketing Trends for 2024',
        excerpt: 'Stay ahead with these emerging trends',
        image: '/api/placeholder/200/120',
        url: '/blog/digital-marketing-trends-2024'
      },
      {
        title: 'The Psychology of Persuasive Copy',
        excerpt: 'Write copy that converts readers',
        image: '/api/placeholder/200/120',
        url: '/blog/persuasive-copywriting'
      },
      {
        title: 'Building Brand Authority Online',
        excerpt: 'Establish yourself as an industry leader',
        image: '/api/placeholder/200/120',
        url: '/blog/brand-authority-online'
      }
    ]
  } = section.settings

  return (
    <article className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{article.meta.category}</Badge>
              {article.meta.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {show_article_meta && (
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By {article.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.meta.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{article.meta.read_time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{article.meta.views} views</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{article.meta.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{article.meta.comments}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Social Sharing */}
            {show_social_sharing && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Share:</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          <Separator className="my-12" />

          {/* Author Bio */}
          {show_author_bio && (
            <Card className="mb-12">
              <CardContent className="p-8">
                <div className="flex gap-6">
                  <img
                    src={article.author.image}
                    alt={article.author.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      About {article.author.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {article.author.bio}
                    </p>
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://twitter.com/${article.author.social.twitter}`} target="_blank">
                          <Twitter className="h-4 w-4 mr-2" />
                          Follow on Twitter
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://linkedin.com${article.author.social.linkedin}`} target="_blank">
                          <Linkedin className="h-4 w-4 mr-2" />
                          Connect on LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Navigation */}
          {show_navigation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {navigation.previous && (
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Article
                    </div>
                    <Link href={navigation.previous.url} className="group-hover:text-primary transition-colors">
                      <h4 className="font-semibold">{navigation.previous.title}</h4>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {navigation.next && (
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      Next Article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <Link href={navigation.next.url} className="group-hover:text-primary transition-colors">
                      <h4 className="font-semibold">{navigation.next.title}</h4>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Related Articles */}
          {show_related_articles && (
            <div>
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related_articles.map((relatedArticle, index) => (
                  <Card key={index} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={relatedArticle.url}>
                          {relatedArticle.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// Section Schema
export const schema = {
  name: 'Article Content',
  settings: [
    {
      type: 'checkbox',
      id: 'show_article_meta',
      label: 'Show article metadata',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_social_sharing',
      label: 'Show social sharing buttons',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_author_bio',
      label: 'Show author bio',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_related_articles',
      label: 'Show related articles',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_navigation',
      label: 'Show previous/next navigation',
      default: true
    }
  ]
}