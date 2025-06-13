
import { useQuery, useMutation } from "@apollo/client";
import { USERS_QUERY, CREATE_CUSTOMER_MUTATION, CHECK_COMPANY_NAME_QUERY } from "../lib/graphql/customerOperations";
import { useTranslation } from "./useLanguage";

export function useUsers(search = "", limit = 10, offset = 0) {
  const { loading, data, error, refetch } = useQuery(USERS_QUERY, {
    variables: { limit, offset, search },
    errorPolicy: 'all'
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch
  };
}

export function useCreateCustomer() {
  const { t } = useTranslation();
  
  const [createCustomerMutation, { loading, error, data }] = useMutation(CREATE_CUSTOMER_MUTATION, {
    errorPolicy: 'all'
  });

  const createCustomer = async (input) => {
    try {
      const result = await createCustomerMutation({
        variables: { input }
      });
      return {
        success: true,
        data: result.data?.createCustomer,
        message: t("customers.messages.createSuccess")
      };
    } catch (err) {
      console.error("Create customer error:", err);
      return {
        success: false,
        error: err,
        message: t("customers.messages.createError")
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
  const [checkCompanyName, { loading, data, error }] = useMutation(CHECK_COMPANY_NAME_QUERY, {
    errorPolicy: 'all'
  });

  const checkName = async (name) => {
    try {
      const result = await checkCompanyName({
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
