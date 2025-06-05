
import { gql } from "@apollo/client";


export const GET_MARKETING_STATS = gql`
  query GetMarketingStats {
    marketingStats {
      totalPosts {
        today
        week
        month
      }
      pendingApproval
      errors
      abTestGroups {
        active
        completed
      }
      trendingKeywords
    }
  }
`;

export const GET_CONTENTS = gql`
  query GetContents($limit: Int, $offset: Int, $status: String) {
    contents(limit: $limit, offset: $offset, status: $status) {
      contents {
        id
        title
        description
        content
        mediaType
        mode
        keywords
        status
        platforms
        aiGenerated
        confidence
        userId
        user {
          id
          name
          email
        }
        engagement {
          views
          likes
          shares
          comments
          ctr
          engagementRate
        }
        analytics {
          reach
          impressions
          clicks
          conversions
          revenue
          roi
        }
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

export const GET_CONTENT_BY_ID = gql`
  query GetContent($id: ID!) {
    content(id: $id) {
      id
      title
      description
      content
      mediaType
      mode
      keywords
      status
      platforms
      aiGenerated
      confidence
      user {
        id
        name
        email
      }
      engagement {
        views
        likes
        shares
        comments
        ctr
        engagementRate
      }
      analytics {
        reach
        impressions
        clicks
        conversions
        revenue
        roi
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONTENT_LIST = gql`
  query GetContentList($limit: Int, $offset: Int, $status: String) {
    contents(limit: $limit, offset: $offset, status: $status) {
      contents {
        id
        title
        description
        mediaType
        status
        platforms
        aiGenerated
        user {
          name
        }
        createdAt
      }
      total
      hasMore
    }
  }
`;

export const GET_CONTENT_STATS = gql`
  query GetContentStats {
    contentStats {
      total
      published
      pending
      approved
      rejected
      scheduled
    }
  }
`;

export const GET_CONTENT_PERFORMANCE = gql`
  query GetContentPerformance($id: ID!) {
    contentPerformance(id: $id) {
      id
      title
      engagement {
        views
        likes
        shares
        comments
        ctr
        engagementRate
      }
      analytics {
        reach
        impressions
        clicks
        conversions
        revenue
        roi
      }
    }
  }
`;

export const GET_TOP_PERFORMING_CONTENT = gql`
  query GetTopPerformingContent($limit: Int) {
    topPerformingContent(limit: $limit) {
      id
      title
      platforms
      engagement {
        views
        likes
        engagementRate
      }
      createdAt
    }
  }
`;

export const GET_PLATFORM_STATS = gql`
  query GetPlatformStats {
    platformStats {
      id
      name
      todayPosts
      successCount
      failureCount
      failureRate
      lastError
      status
      realTimeMetrics {
        activeConnections
        queuedPosts
        postsPerMinute
        averageResponseTime
        errorRate
        uptime
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POSTING_LOGS = gql`
  query GetPostingLogs($platform: String, $level: String, $limit: Int) {
    postingLogs(platform: $platform, level: $level, limit: $limit) {
      id
      timestamp
      level
      platform
      workerId
      component
      message
      contentId
      error
      content {
        id
        title
      }
      createdAt
    }
  }
`;

export const GET_SYSTEM_HEALTH = gql`
  query GetSystemHealth {
    systemHealth {
      overallStatus
      activePlatforms
      totalErrors
      averageResponseTime
      systemUptime
      memoryUsage
      cpuUsage
    }
  }
`;

export const GET_REALTIME_METRICS = gql`
  query GetRealtimeMetrics($platform: String) {
    realtimeMetrics(platform: $platform) {
      activeConnections
      queuedPosts
      postsPerMinute
      averageResponseTime
      errorRate
      uptime
    }
  }
`;

export const GET_TRENDING_KEYWORDS = gql`
  query GetTrendingKeywords($period: String) {
    trendingKeywords(period: $period) {
      id
      keyword
      mentions
      growth
      sentiment
      relatedKeywords
      period
      source
      createdAt
    }
  }
`;

export const GET_TREND_ANALYSIS = gql`
  query GetTrendAnalysis($period: String) {
    trendAnalysis(period: $period) {
      id
      topic
      description
      growth
      type
      opportunity
      risk
      period
      confidence
      createdAt
    }
  }
`;

export const GET_AB_TEST_GROUPS = gql`
  query GetABTestGroups($status: String) {
    abTestGroups(status: $status) {
      id
      name
      description
      status
      winner
      confidence
      duration
      startedAt
      endedAt
      variants {
        id
        name
        content
        views
        engagement
        ctr
        conversions
        revenue
        performance {
          conversionRate
          engagementRate
          revenuePerView
          statistical_significance
        }
      }
      createdAt
    }
  }
`;

export const GET_AB_TEST_GROUP = gql`
  query GetABTestGroup($id: ID!) {
    abTestGroup(id: $id) {
      id
      name
      description
      status
      winner
      confidence
      duration
      startedAt
      endedAt
      variants {
        id
        name
        content
        views
        engagement
        ctr
        conversions
        revenue
      }
      createdAt
    }
  }
`;

export const GET_AB_TEST_STATS = gql`
  query GetABTestStats {
    abTestStats {
      totalTests
      activeTests
      completedTests
      avgImprovement
      topPerformingVariant {
        id
        name
        ctr
      }
    }
  }
`;

export const GET_AB_TEST_RESULTS = gql`
  query GetABTestResults($id: ID!) {
    abTestResults(id: $id) {
      totalViews
      totalEngagement
      totalConversions
      totalRevenue
      winningVariant {
        id
        name
        ctr
      }
      confidence
      significance
      improvement
    }
  }
`;

export const GET_RUNNING_AB_TESTS = gql`
  query GetRunningABTests {
    runningABTests {
      id
      name
      status
      startedAt
      endedAt
      variants {
        id
        name
        views
        ctr
      }
    }
  }
`;

export const GET_POST_DETAILS = gql`
  query GetPostDetails($postId: ID!) {
    postDetails(id: $postId) {
      id
      title
      content
      platform
      status
      metrics {
        views
        likes
        shares
        comments
        engagement
        reach
      }
      scheduledAt
      publishedAt
      createdAt
    }
  }
`;

export const GET_MARKETING_INSIGHTS = gql`
  query GetMarketingInsights($period: String) {
    marketingInsights(period: $period) {
      kpiData {
        totalReach {
          value
          change
          period
        }
        totalViews {
          value
          change
          period
        }
        totalEngagement {
          value
          change
          period
        }
        avgEngagementRate {
          value
          change
          period
        }
      }
      topPerformingContent {
        id
        title
        platform
        reach
        engagement
        ctr
        postedAt
      }
      audienceInsights {
        demographics {
          ageGroup
          percentage
        }
        interests {
          category
          affinity
        }
        peakTimes {
          hour
          engagement
        }
      }
      competitorAnalysis {
        competitor
        reach
        engagement
        marketShare
      }
    }
  }
`;
