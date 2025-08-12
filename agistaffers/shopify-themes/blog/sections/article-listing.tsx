'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  User, 
  BookOpen, 
  ArrowRight,
  Grid3X3,
  List,
  Filter,
  Clock
} from 'lucide-react'

export default function ArticleListingSection({ section, settings }: SectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')

  const {
    heading = 'Latest Articles',
    subheading = 'Insights, tips, and strategies from our experts',
    posts_per_page = 12,
    show_filters = true,
    show_view_toggle = true,
    show_load_more = true,
    articles = [
      {
        id: '1',
        title: 'The Complete Guide to Content Marketing in 2024',
        excerpt: 'Learn how to create, distribute, and measure content that drives real business results.',
        author: 'Sarah Johnson',
        date: '2024-01-15',
        category: 'Content Marketing',
        tags: ['Marketing', 'Strategy', 'Content'],
        image: '/api/placeholder/400/250',
        read_time: '12 min read',
        url: '/blog/content-marketing-guide-2024',
        featured: true
      },
      {
        id: '2',
        title: 'How to Build a High-Converting Sales Funnel',
        excerpt: 'Step-by-step process to create sales funnels that turn visitors into customers.',
        author: 'Mike Chen',
        date: '2024-01-12',
        category: 'Sales',
        tags: ['Sales', 'Conversion', 'Funnel'],
        image: '/api/placeholder/400/250',
        read_time: '8 min read',
        url: '/blog/sales-funnel-guide',
        featured: false
      },
      {
        id: '3',
        title: 'Digital Marketing Trends That Will Dominate 2024',
        excerpt: 'Stay ahead of the curve with these emerging digital marketing trends and strategies.',
        author: 'Jennifer Davis',
        date: '2024-01-10',
        category: 'Digital Marketing',
        tags: ['Trends', 'Digital Marketing', 'Future'],
        image: '/api/placeholder/400/250',
        read_time: '15 min read',
        url: '/blog/digital-marketing-trends-2024',
        featured: false
      },
      {
        id: '4',
        title: 'The Psychology of Persuasive Web Design',
        excerpt: 'Understand how psychology principles can improve your website\'s conversion rates.',
        author: 'Alex Rodriguez',
        date: '2024-01-08',
        category: 'Web Design',
        tags: ['Psychology', 'UX', 'Conversion'],
        image: '/api/placeholder/400/250',
        read_time: '10 min read',
        url: '/blog/psychology-web-design',
        featured: false
      },
      {
        id: '5',
        title: 'SEO Strategies That Actually Work in 2024',
        excerpt: 'Cut through the noise with SEO tactics that deliver real organic traffic growth.',
        author: 'Rachel Kim',
        date: '2024-01-05',
        category: 'SEO',
        tags: ['SEO', 'Organic Traffic', 'Search'],
        image: '/api/placeholder/400/250',
        read_time: '14 min read',
        url: '/blog/seo-strategies-2024',
        featured: false
      },
      {
        id: '6',
        title: 'Building a Personal Brand as an Entrepreneur',
        excerpt: 'Learn how to establish yourself as a thought leader in your industry.',
        author: 'David Park',
        date: '2024-01-03',
        category: 'Personal Branding',
        tags: ['Branding', 'Entrepreneur', 'Leadership'],
        image: '/api/placeholder/400/250',
        read_time: '11 min read',
        url: '/blog/personal-brand-entrepreneur',
        featured: false
      }
    ]
  } = section.settings

  const categories = Array.from(new Set(articles.map(article => article.category)))

  const ArticleCard = ({ article, mode }: { article: any; mode: 'grid' | 'list' }) => {
    if (mode === 'list') {
      return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <CardContent className="md:w-2/3 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{article.category}</Badge>
                {article.featured && (
                  <Badge className="bg-red-500 text-white">Featured</Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-3 line-clamp-2">
                <Link href={article.url} className="hover:text-primary transition-colors">
                  {article.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.read_time}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link href={article.url}>
                    Read More
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )
    }

    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            {article.featured && (
              <Badge className="bg-red-500 text-white">Featured</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={article.url}>
              {article.title}
            </Link>
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {article.author}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {article.read_time}
              </div>
            </div>
            
            <span>{article.date}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        {/* Controls */}
        {(show_filters || show_view_toggle) && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Filter */}
              {show_filters && (
                <div className="flex gap-3">
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="featured">Featured First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {articles.length} articles found
              </span>

              {/* View Toggle */}
              {show_view_toggle && (
                <div className="flex border rounded-md">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6'
        } mb-12`}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} mode={viewMode} />
          ))}
        </div>

        {/* Load More / Pagination */}
        {show_load_more && (
          <div className="text-center">
            <Button size="lg" variant="outline">
              Load More Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Showing 6 of 24 articles
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Article Listing',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Latest Articles'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'Insights, tips, and strategies from our experts'
    },
    {
      type: 'range',
      id: 'posts_per_page',
      label: 'Posts per page',
      min: 6,
      max: 24,
      step: 3,
      default: 12
    },
    {
      type: 'checkbox',
      id: 'show_filters',
      label: 'Show category filters',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_view_toggle',
      label: 'Show grid/list toggle',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_load_more',
      label: 'Show load more button',
      default: true
    }
  ]
}