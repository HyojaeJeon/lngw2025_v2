
import { gql } from '@apollo/client';

// 마케팅 계획 뮤테이션
export const CREATE_MARKETING_PLAN = gql`
  mutation CreateMarketingPlan($input: MarketingPlanInput!) {
    createMarketingPlan(input: $input) {
      id
      title
      description
      startDate
      endDate
      manager
      targetPersona
      coreMessage
      status
      user {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

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
      user {
        id
        name
        email
      }
      objectives {
        id
        title
        description
        priority
        status
        progress
        keyResults {
          id
          title
          description
          targetValue
          currentValue
          unit
          status
          progress
          checklist {
            id
            text
            completed
            completedAt
            sortOrder
          }
        }
      }
      createdAt
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
  }
`;

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
      updatedAt
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

export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: ID!) {
    deleteContent(id: $id) {
      success
      message
    }
  }
`;

export const SCHEDULE_POST = gql`
  mutation SchedulePost($input: SchedulePostInput!) {
    schedulePost(input: $input) {
      id
      contentId
      platform
      scheduledTime
      status
      mode
    }
  }
`;

export const CREATE_MARKETING_OBJECTIVE = gql`
  mutation CreateMarketingObjective($planId: ID!, $input: MarketingObjectiveInput!) {
    createMarketingObjective(planId: $planId, input: $input) {
      id
      title
      description
      priority
      status
      progress
      keyResults {
        id
        title
        description
        targetValue
        currentValue
        unit
        status
        progress
        checklist {
          id
          text
          completed
          completedAt
          sortOrder
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MARKETING_OBJECTIVE = gql`
  mutation UpdateMarketingObjective($id: ID!, $input: MarketingObjectiveInput!) {
    updateMarketingObjective(id: $id, input: $input) {
      id
      title
      description
      priority
      status
      progress
      keyResults {
        id
        title
        description
        targetValue
        currentValue
        unit
        status
        progress
        checklist {
          id
          text
          completed
          completedAt
          sortOrder
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_MARKETING_OBJECTIVE = gql`
  mutation DeleteMarketingObjective($id: ID!) {
    deleteMarketingObjective(id: $id)
  }
`;

export const CREATE_KEY_RESULT = gql`
  mutation CreateKeyResult($objectiveId: ID!, $input: KeyResultInput!) {
    createKeyResult(objectiveId: $objectiveId, input: $input) {
      id
      title
      description
      targetValue
      currentValue
      unit
      status
      progress
      checklist {
        id
        text
        completed
        completedAt
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_KEY_RESULT = gql`
  mutation UpdateKeyResult($id: ID!, $input: KeyResultInput!) {
    updateKeyResult(id: $id, input: $input) {
      id
      title
      description
      targetValue
      currentValue
      unit
      status
      progress
      checklist {
        id
        text
        completed
        completedAt
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KEY_RESULT = gql`
  mutation DeleteKeyResult($id: ID!) {
    deleteKeyResult(id: $id)
  }
`;

export const CREATE_CHECKLIST_ITEM = gql`
  mutation CreateChecklistItem($keyResultId: ID!, $input: ChecklistItemInput!) {
    createChecklistItem(keyResultId: $keyResultId, input: $input) {
      id
      text
      completed
      completedAt
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CHECKLIST_ITEM = gql`
  mutation UpdateChecklistItem($id: ID!, $input: ChecklistItemInput!) {
    updateChecklistItem(id: $id, input: $input) {
      id
      text
      completed
      completedAt
      sortOrder
      updatedAt
    }
  }
`;

export const DELETE_CHECKLIST_ITEM = gql`
  mutation DeleteChecklistItem($id: ID!) {
    deleteChecklistItem(id: $id)
  }
`;

export const TOGGLE_CHECKLIST_ITEM = gql`
  mutation ToggleChecklistItem($id: ID!) {
    toggleChecklistItem(id: $id) {
      id
      text
      completed
      completedAt
      sortOrder
      updatedAt
    }
  }
`;
