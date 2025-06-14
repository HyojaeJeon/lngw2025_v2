
import { gql } from '@apollo/client';

// VOC 목록 조회
export const GET_VOCS = gql`
  query GetVocs($filter: VocFilter, $limit: Int, $offset: Int) {
    vocs(filter: $filter, limit: $limit, offset: $offset) {
      id
      type
      title
      content
      priority
      status
      attachments
      createdAt
      updatedAt
      resolvedAt
      customer {
        id
        name
        email
        phone
      }
      contactPerson {
        id
        name
        position
        email
        phone
      }
      assignedTo {
        id
        name
        email
      }
      creator {
        id
        name
        email
      }
    }
  }
`;

// VOC 상세 조회
export const GET_VOC = gql`
  query GetVoc($id: ID!) {
    voc(id: $id) {
      id
      type
      title
      content
      priority
      status
      resolution
      attachments
      createdAt
      updatedAt
      resolvedAt
      customer {
        id
        name
        email
        phone
        industry
        address
      }
      contactPerson {
        id
        name
        position
        email
        phone
        department
      }
      assignedTo {
        id
        name
        email
        department
        position
      }
      creator {
        id
        name
        email
        department
        position
      }
    }
  }
`;

// VOC 통계 조회
export const GET_VOC_STATS = gql`
  query GetVocStats {
    vocStats {
      total
      pending
      inProgress
      resolved
      byPriority {
        high
        medium
        low
      }
      byType {
        type
        count
      }
    }
  }
`;

// VOC 생성
export const CREATE_VOC = gql`
  mutation CreateVoc($input: VocInput!) {
    createVoc(input: $input) {
      id
      type
      title
      content
      priority
      status
      attachments
      createdAt
      customer {
        id
        name
        email
      }
      contactPerson {
        id
        name
        position
      }
      assignedTo {
        id
        name
        email
      }
      creator {
        id
        name
        email
      }
    }
  }
`;

// VOC 수정
export const UPDATE_VOC = gql`
  mutation UpdateVoc($id: ID!, $input: VocUpdateInput!) {
    updateVoc(id: $id, input: $input) {
      id
      type
      title
      content
      priority
      status
      resolution
      attachments
      createdAt
      updatedAt
      resolvedAt
      customer {
        id
        name
        email
      }
      contactPerson {
        id
        name
        position
      }
      assignedTo {
        id
        name
        email
      }
      creator {
        id
        name
        email
      }
    }
  }
`;

// VOC 삭제
export const DELETE_VOC = gql`
  mutation DeleteVoc($id: ID!) {
    deleteVoc(id: $id) {
      success
      message
    }
  }
`;

// VOC 할당
export const ASSIGN_VOC = gql`
  mutation AssignVoc($id: ID!, $assignedToId: ID!) {
    assignVoc(id: $id, assignedToId: $assignedToId) {
      id
      status
      assignedTo {
        id
        name
        email
      }
    }
  }
`;

// VOC 해결
export const RESOLVE_VOC = gql`
  mutation ResolveVoc($id: ID!, $resolution: String!) {
    resolveVoc(id: $id, resolution: $resolution) {
      id
      status
      resolution
      resolvedAt
    }
  }
`;
