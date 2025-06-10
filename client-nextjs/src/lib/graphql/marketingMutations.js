
import { gql } from '@apollo/client';

export const UPDATE_MARKETING_PLAN = gql`
  mutation UpdateMarketingPlan($id: ID!, $input: MarketingPlanInput!) {
    updateMarketingPlan(id: $id, input: $input) {
      id
      title
      description
      startDate
      endDate
      manager
      targetPersona
      coreMessage
      status
      updatedAt
    }
  }
`;

export const GET_USERS_FOR_ASSIGNMENT = gql`
  query GetUsersForAssignment($offset: Int, $limit: Int) {
    users(offset: $offset, limit: $limit) {
      id
      name
      email
      position
      avatar
    }
    usersCount
  }
`;

import { gql } from '@apollo/client';

// 콘텐츠 관리 뮤테이션
export const CREATE_CONTENT = gql`
  mutation CreateContent($input: ContentInput!) {
    createContent(input: $input) {
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
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_CONTENT = gql`
  mutation UpdateContent($id: ID!, $input: ContentInput!) {
    updateContent(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const APPROVE_CONTENT = gql`
  mutation ApproveContent($id: ID!, $reason: String) {
    approveContent(id: $id, reason: $reason) {
      id
      status
      approvedAt
    }
  }
`;

export const REJECT_CONTENT = gql`
  mutation RejectContent($id: ID!, $reason: String!) {
    rejectContent(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: ID!) {
    deleteContent(id: $id)
  }
`;

export const GENERATE_CONTENT = gql`
  mutation GenerateContent($input: GenerateContentInput!) {
    generateContent(input: $input) {
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
      createdAt
    }
  }
`;

export const BULK_CONTENT_ACTION = gql`
  mutation BulkContentAction($ids: [ID!]!, $action: String!, $reason: String) {
    bulkContentAction(ids: $ids, action: $action, reason: $reason)
  }
`;

export const SCHEDULE_CONTENT = gql`
  mutation ScheduleContent($id: ID!, $scheduledAt: Date!) {
    scheduleContent(id: $id, scheduledAt: $scheduledAt) {
      id
      status
      scheduledAt
    }
  }
`;

export const PUBLISH_CONTENT = gql`
  mutation PublishContent($id: ID!) {
    publishContent(id: $id) {
      id
      status
      publishedAt
    }
  }
`;

// 게시 예약 뮤테이션
export const SCHEDULE_POST = gql`
  mutation SchedulePost($input: SchedulePostInput!) {
    schedulePost(input: $input) {
      id
      contentId
      scheduledTime
      platform
      mode
      approvalStatus
      scheduleStatus
      createdAt
    }
  }
`;

export const UPDATE_SCHEDULED_POST = gql`
  mutation UpdateScheduledPost($id: ID!, $scheduledTime: String!) {
    updateScheduledPost(id: $id, scheduledTime: $scheduledTime) {
      id
      scheduledTime
      updatedAt
    }
  }
`;

export const CANCEL_SCHEDULED_POST = gql`
  mutation CancelScheduledPost($id: ID!) {
    cancelScheduledPost(id: $id) {
      id
      scheduleStatus
      cancelledAt
    }
  }
`;

// A/B 테스트 뮤테이션
export const CREATE_ABTEST_GROUP = gql`
  mutation CreateABTestGroup($input: ABTestGroupInput!) {
    createABTestGroup(input: $input) {
      id
      name
      description
      status
      variants {
        id
        name
        content
      }
      createdAt
    }
  }
`;

export const START_ABTEST = gql`
  mutation StartABTest($id: ID!) {
    startABTest(id: $id) {
      id
      status
      startedAt
      endDate
    }
  }
`;

export const END_ABTEST = gql`
  mutation EndABTest($id: ID!) {
    endABTest(id: $id) {
      id
      status
      endedAt
      winner
      confidence
    }
  }
`;

export const DELETE_ABTEST_GROUP = gql`
  mutation DeleteABTestGroup($id: ID!) {
    deleteABTestGroup(id: $id) {
      success
      message
    }
  }
`;

// 참여 관리 뮤테이션
export const RESPOND_TO_ENGAGEMENT = gql`
  mutation RespondToEngagement($id: ID!, $response: String!) {
    respondToEngagement(id: $id, response: $response) {
      id
      status
      response
      timestamp
    }
  }
`;

export const CREATE_AUTOMATION_RULE = gql`
  mutation CreateAutomationRule($input: AutomationRuleInput!) {
    createAutomationRule(input: $input) {
      id
      name
      platform
      trigger
      action
      isActive
      responses
    }
  }
`;
export const UPDATE_AUTOMATION_RULE = gql`
  mutation UpdateAutomationRule($id: ID!, $input: AutomationRuleInput!) {
    updateAutomationRule(id: $id, input: $input) {
      id
      name
      platform
      trigger
      action
      isActive
      responses
      updatedAt
    }
  }
`;

export const TOGGLE_AUTOMATION_RULE = gql`
  mutation ToggleAutomationRule($id: ID!) {
    toggleAutomationRule(id: $id) {
      id
      isActive
    }
  }
`;