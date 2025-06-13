
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { USERS_QUERY, CREATE_CUSTOMER_MUTATION, CHECK_COMPANY_NAME_QUERY } from "../lib/graphql/customerOperations";
import { useTranslation } from "./useLanguage";

export function useUsers(search = "", limit = 10, offset = 0) {
  const { loading, data, error, refetch, fetchMore } = useQuery(USERS_QUERY, {
    variables: { limit, offset, search },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
    fetchMore
  };
}

export function useCreateCustomer() {
  const { t } = useTranslation();
  
  const [createCustomerMutation, { loading, error, data }] = useMutation(CREATE_CUSTOMER_MUTATION, {
    errorPolicy: 'all'
  });

  const createCustomer = async (variables) => {
    try {
      const result = await createCustomerMutation(variables);
      return {
        success: true,
        data: result.data?.createCustomer,
        message: t("customers.messages.createSuccess") || "고객사가 성공적으로 등록되었습니다."
      };
    } catch (err) {
      console.error("Create customer error:", err);
      return {
        success: false,
        error: err,
        message: t("customers.messages.createError") || "고객사 등록 중 오류가 발생했습니다."
      };
    }
  };

  return {
    createCustomer,
    loading,
    error,
    data
  };
}

export function useCheckCompanyName() {
  const [checkCompanyNameQuery, { loading, data, error }] = useLazyQuery(CHECK_COMPANY_NAME_QUERY, {
    errorPolicy: 'all'
  });

  const checkName = async (name) => {
    try {
      const result = await checkCompanyNameQuery({
        variables: { name }
      });
      return result.data?.checkCompanyName;
    } catch (err) {
      console.error("Check company name error:", err);
      return { exists: false, message: "Error checking company name" };
    }
  };

  return {
    checkName,
    loading,
    result: data?.checkCompanyName,
    error
  };
}
