"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useLanguage';
import { useErrorHandler, validateForm } from '@/lib/errorHandler';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import CustomSelect from '@/components/common/CustomSelect';
import NumberInput from '@/components/common/NumberInput';
import ImageUploader from '@/components/common/ImageUploader';

// GraphQL 쿼리 및 뮤테이션
const GET_CATEGORIES = gql`
  query GetCategories($isActive: Boolean) {
    categories(isActive: $isActive) {
      id
      code
      names {
        ko
        en
        vi
      }
      isActive
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      success
      message
      product {
        id
        name
        code
        description
        category {
          id
          names
        }
        price
        currentStock
        status
        isActive
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECK_PRODUCT_CODE = gql`
  query CheckProductCode($code: String!) {
    checkProductCode(code: $code) {
      isAvailable
      message
    }
  }
`;

const CHECK_PRODUCT_MODEL_CODE = gql`
  query CheckProductModelCode($productId: Int!, $modelCode: String!) {
    checkProductModelCode(productId: $productId, modelCode: $modelCode) {
      isAvailable
      message
    }
  }
`;

const CREATE_PRODUCT_MODEL = gql`
  mutation CreateProductModel($productId: Int!, $input: ProductModelInput!) {
    createProductModel(productId: $productId, input: $input) {
      success
      message
      productModel {
        id
        modelName
        modelCode
        price
        currentStock
        status
        isActive
      }
      errors {
        field
        message
      }
    }
  }
`;

const ProductAddModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { handleError, handleValidationError } = useErrorHandler();
  
  // 제품 타입 상태
  const [productType, setProductType] = useState('single'); // 'single' 또는 'models'
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    specifications: '',
    categoryId: null,
    price: null,
    consumerPrice: null,
    cost: null,
    currentStock: 0,
    minStock: 0,
    maxStock: null,
    status: 'active',
    weight: null,
    dimensions: { length: null, width: null, height: null },
    brand: '',
    manufacturer: '',
    modelNumber: '',
    tagIds: [],
    images: [],
    launchDate: '',
    sortOrder: 1,
    isActive: true,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // 모델 관리 상태
  const [productModels, setProductModels] = useState([
    {
      id: Date.now(),
      modelName: '',
      modelCode: '',
      description: '',
      price: null,
      consumerPrice: null,
      cost: null,
      currentStock: 0,
      minStock: 0,
      maxStock: null,
      weight: null,
      dimensions: { length: null, width: null, height: null },
      images: [],
      color: '',
      size: '',
      material: '',
      status: 'active',
      isActive: true
    }
  ]);

  const [errors, setErrors] = useState({});
  const [modelErrors, setModelErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeCheckResult, setCodeCheckResult] = useState(null);
  const [modelCodeChecking, setModelCodeChecking] = useState({});
  const [modelCodeResults, setModelCodeResults] = useState({});

  // GraphQL 훅
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
    variables: { isActive: true },
    onError: (error) => handleError(error)
  });

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.createProduct.success) {
        onSuccess && onSuccess(data.createProduct.product);
        handleClose();
      } else {
        const fieldErrors = {};
        data.createProduct.errors?.forEach(error => {
          fieldErrors[error.field] = error.message;
        });
        setErrors(fieldErrors);
      }
    },
    onError: (error) => {
      const { errorMessage } = handleValidationError(error, errors);
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    }
  });

  const [checkProductCode] = useLazyQuery(CHECK_PRODUCT_CODE);
  const [checkProductModelCode] = useLazyQuery(CHECK_PRODUCT_MODEL_CODE);
  const [createProductModel] = useMutation(CREATE_PRODUCT_MODEL);

  // 카테고리 옵션 준비
  const categoryOptions = categoriesData?.categories || [];

  // 폼 필드 변경 처리
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 메시지 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // 상품 코드 중복 확인
    if (field === 'code' && value) {
      debounceCodeCheck(value);
    }
  };

  // 중첩 객체 필드 변경 처리
  const handleNestedFieldChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  // 상품 코드 중복 확인 (디바운스)
  const debounceCodeCheck = React.useCallback(
    debounce(async (code) => {
      if (!code || code.length < 2) {
        setCodeCheckResult(null);
        return;
      }

      setCodeChecking(true);
      try {
        const result = await checkProductCode({ variables: { code: code.toUpperCase() } });
        if (result.data) {
          setCodeCheckResult(result.data.checkProductCode);
        }
      } catch (error) {
        console.error('Code check failed:', error);
      } finally {
        setCodeChecking(false);
      }
    }, 500),
    [checkProductCode]
  );

  // 디바운스 유틸리티
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 모델 추가
  const addProductModel = () => {
    const newModel = {
      id: Date.now(),
      modelName: '',
      modelCode: '',
      description: '',
      price: null,
      consumerPrice: null,
      cost: null,
      currentStock: 0,
      minStock: 0,
      maxStock: null,
      weight: null,
      dimensions: { length: null, width: null, height: null },
      images: [],
      color: '',
      size: '',
      material: '',
      status: 'active',
      isActive: true
    };
    setProductModels(prev => [...prev, newModel]);
  };

  // 모델 삭제
  const removeProductModel = (modelId) => {
    if (productModels.length > 1) {
      setProductModels(prev => prev.filter(model => model.id !== modelId));
      // 관련 에러 메시지도 제거
      setModelErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[modelId];
        return newErrors;
      });
      setModelCodeResults(prev => {
        const newResults = { ...prev };
        delete newResults[modelId];
        return newResults;
      });
    }
  };

  // 모델 필드 변경
  const handleModelFieldChange = (modelId, field, value) => {
    setProductModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, [field]: value }
        : model
    ));

    // 에러 메시지 클리어
    if (modelErrors[modelId]?.[field]) {
      setModelErrors(prev => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          [field]: null
        }
      }));
    }

    // 모델 코드 중복 확인
    if (field === 'modelCode' && value && formData.categoryId) {
      debounceModelCodeCheck(modelId, value);
    }
  };

  // 모델 중첩 필드 변경
  const handleModelNestedFieldChange = (modelId, parentField, childField, value) => {
    setProductModels(prev => prev.map(model => 
      model.id === modelId 
        ? {
            ...model,
            [parentField]: {
              ...model[parentField],
              [childField]: value
            }
          }
        : model
    ));
  };

  // 모델 코드 중복 확인 (디바운스)
  const debounceModelCodeCheck = React.useCallback(
    debounce(async (modelId, code) => {
      if (!code || code.length < 2 || !formData.categoryId) {
        setModelCodeResults(prev => ({ ...prev, [modelId]: null }));
        return;
      }

      setModelCodeChecking(prev => ({ ...prev, [modelId]: true }));
      
      try {
        // 임시 productId로 체크 (실제로는 상품 생성 후 체크해야 함)
        const result = await checkProductModelCode({ 
          variables: { 
            productId: 1, // 임시값
            modelCode: code.toUpperCase() 
          } 
        });
        
        if (result.data) {
          setModelCodeResults(prev => ({
            ...prev,
            [modelId]: result.data.checkProductModelCode
          }));
        }
      } catch (error) {
        console.error('Model code check failed:', error);
      } finally {
        setModelCodeChecking(prev => ({ ...prev, [modelId]: false }));
      }
    }, 500),
    [checkProductModelCode, formData.categoryId]
  );

  // 폼 유효성 검사
  const validateFormData = () => {
    const rules = {
      name: { required: true, minLength: 2, maxLength: 255 },
      code: { required: true, minLength: 2, maxLength: 100 },
      categoryId: { required: true },
      price: { required: true, type: 'price' },
      currentStock: { required: true, type: 'stock' }
    };

    const validationErrors = validateForm(formData, rules);
    
    // 상품 코드 중복 확인 결과 검사
    if (codeCheckResult && !codeCheckResult.isAvailable) {
      validationErrors.code = codeCheckResult.message;
    }

    return validationErrors;
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 이미지 URL 배열로 변환
      const imageUrls = formData.images.map(img => img.url);
      
      // dimensions가 빈 값들로만 구성된 경우 null로 처리
      const dimensions = formData.dimensions.length || formData.dimensions.width || formData.dimensions.height
        ? formData.dimensions
        : null;

      const input = {
        ...formData,
        code: formData.code.toUpperCase(),
        images: imageUrls,
        dimensions: dimensions,
        // null 값들 제거
        consumerPrice: formData.consumerPrice || null,
        cost: formData.cost || null,
        maxStock: formData.maxStock || null,
        weight: formData.weight || null,
        launchDate: formData.launchDate || null,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        seoKeywords: formData.seoKeywords || null
      };

      await createProduct({ variables: { input } });
    } catch (error) {
      console.error('Product creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    setProductType('single');
    setFormData({
      name: '',
      code: '',
      description: '',
      specifications: '',
      categoryId: null,
      price: null,
      consumerPrice: null,
      cost: null,
      currentStock: 0,
      minStock: 0,
      maxStock: null,
      status: 'active',
      weight: null,
      dimensions: { length: null, width: null, height: null },
      brand: '',
      manufacturer: '',
      modelNumber: '',
      tagIds: [],
      images: [],
      launchDate: '',
      sortOrder: 1,
      isActive: true,
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setProductModels([{
      id: Date.now(),
      modelName: '',
      modelCode: '',
      description: '',
      price: null,
      consumerPrice: null,
      cost: null,
      currentStock: 0,
      minStock: 0,
      maxStock: null,
      weight: null,
      dimensions: { length: null, width: null, height: null },
      images: [],
      color: '',
      size: '',
      material: '',
      status: 'active',
      isActive: true
    }]);
    setErrors({});
    setModelErrors({});
    setCodeCheckResult(null);
    setModelCodeChecking({});
    setModelCodeResults({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">새 상품 추가</h2>
            <p className="text-sm text-gray-600 mt-1">상품 정보를 입력하여 새로운 상품을 등록하세요</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 좌측 열 - 이미지 및 기본 정보 */}
              <div className="space-y-6">
                {/* 이미지 업로드 */}
                <div>
                  <ImageUploader
                    value={formData.images}
                    onChange={(images) => handleFieldChange('images', images)}
                    label="상품 이미지"
                    maxFiles={5}
                    error={errors.images}
                  />
                </div>

                {/* 기본 정보 카드 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    기본 정보
                  </h3>

                  {/* 상품명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상품명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="상품명을 입력하세요"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* 상품 코드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상품 코드 (SKU) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${
                          errors.code ? 'border-red-300' : 
                          codeCheckResult?.isAvailable === false ? 'border-red-300' :
                          codeCheckResult?.isAvailable === true ? 'border-green-300' :
                          'border-gray-300'
                        }`}
                        placeholder="예: PROD001"
                      />
                      {codeChecking && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                    {codeCheckResult && (
                      <p className={`mt-1 text-sm ${codeCheckResult.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {codeCheckResult.message}
                      </p>
                    )}
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      value={formData.categoryId}
                      onChange={(value) => handleFieldChange('categoryId', value)}
                      options={categoryOptions}
                      placeholder="카테고리를 선택하세요"
                      displayKey="names"
                      loading={categoriesLoading}
                      error={errors.categoryId}
                    />
                  </div>
                </div>

                {/* 제품 타입 선택 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    제품 타입
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="productType"
                        value="single"
                        checked={productType === 'single'}
                        onChange={(e) => setProductType(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">단일 품목</span>
                      <span className="ml-2 text-xs text-gray-500">하나의 제품으로 등록</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="productType"
                        value="models"
                        checked={productType === 'models'}
                        onChange={(e) => setProductType(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">모델 보유 품목</span>
                      <span className="ml-2 text-xs text-gray-500">여러 모델/옵션이 있는 제품</span>
                    </label>
                  </div>
                </div>

                {/* 모델 등록 (모델 보유 품목 선택 시) */}
                {productType === 'models' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        모델 등록
                      </h3>
                      <button
                        type="button"
                        onClick={addProductModel}
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        + 모델 추가
                      </button>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {productModels.map((model, index) => (
                        <div key={model.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-md font-medium text-gray-900">모델 {index + 1}</h4>
                            {productModels.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProductModel(model.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 모델명 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                모델명 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={model.modelName}
                                onChange={(e) => handleModelFieldChange(model.id, 'modelName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${
                                  modelErrors[model.id]?.modelName ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="모델명 입력"
                              />
                              {modelErrors[model.id]?.modelName && (
                                <p className="mt-1 text-sm text-red-600">{modelErrors[model.id].modelName}</p>
                              )}
                            </div>

                            {/* 모델 코드 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                모델 코드 <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={model.modelCode}
                                  onChange={(e) => handleModelFieldChange(model.id, 'modelCode', e.target.value.toUpperCase())}
                                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${
                                    modelErrors[model.id]?.modelCode ? 'border-red-300' :
                                    modelCodeResults[model.id]?.isAvailable === false ? 'border-red-300' :
                                    modelCodeResults[model.id]?.isAvailable === true ? 'border-green-300' :
                                    'border-gray-300'
                                  }`}
                                  placeholder="MODEL001"
                                />
                                {modelCodeChecking[model.id] && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                  </div>
                                )}
                              </div>
                              {modelErrors[model.id]?.modelCode && (
                                <p className="mt-1 text-sm text-red-600">{modelErrors[model.id].modelCode}</p>
                              )}
                              {modelCodeResults[model.id] && (
                                <p className={`mt-1 text-sm ${modelCodeResults[model.id].isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                  {modelCodeResults[model.id].message}
                                </p>
                              )}
                            </div>

                            {/* 가격 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                판매가 <span className="text-red-500">*</span>
                              </label>
                              <NumberInput
                                value={model.price}
                                onChange={(value) => handleModelFieldChange(model.id, 'price', value)}
                                placeholder="0"
                                currency="KRW"
                                min={0}
                                error={modelErrors[model.id]?.price}
                              />
                            </div>

                            {/* 재고 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                현재 재고 <span className="text-red-500">*</span>
                              </label>
                              <NumberInput
                                value={model.currentStock}
                                onChange={(value) => handleModelFieldChange(model.id, 'currentStock', value)}
                                placeholder="0"
                                min={0}
                                error={modelErrors[model.id]?.currentStock}
                              />
                            </div>

                            {/* 색상 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">색상</label>
                              <input
                                type="text"
                                value={model.color}
                                onChange={(e) => handleModelFieldChange(model.id, 'color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                                placeholder="예: 블랙, 화이트"
                              />
                            </div>

                            {/* 사이즈 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">사이즈</label>
                              <input
                                type="text"
                                value={model.size}
                                onChange={(e) => handleModelFieldChange(model.id, 'size', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                                placeholder="예: S, M, L, XL"
                              />
                            </div>
                          </div>

                          {/* 모델 이미지 */}
                          <div className="mt-4">
                            <ImageUploader
                              value={model.images}
                              onChange={(images) => handleModelFieldChange(model.id, 'images', images)}
                              label={`모델 ${index + 1} 이미지`}
                              maxFiles={3}
                              compact={true}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 제품 사양 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    제품 사양
                  </h3>

                  {/* 브랜드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">브랜드</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleFieldChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      placeholder="브랜드명"
                    />
                  </div>

                  {/* 제조사 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제조사</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => handleFieldChange('manufacturer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      placeholder="제조사명"
                    />
                  </div>

                  {/* 모델 번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">모델 번호</label>
                    <input
                      type="text"
                      value={formData.modelNumber}
                      onChange={(e) => handleFieldChange('modelNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      placeholder="모델 번호"
                    />
                  </div>

                  {/* 무게 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">무게 (kg)</label>
                    <NumberInput
                      value={formData.weight}
                      onChange={(value) => handleFieldChange('weight', value)}
                      placeholder="0.0"
                      decimals={3}
                      min={0}
                    />
                  </div>

                  {/* 크기 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">크기 (cm)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <NumberInput
                        value={formData.dimensions.length}
                        onChange={(value) => handleNestedFieldChange('dimensions', 'length', value)}
                        placeholder="길이"
                        decimals={1}
                        min={0}
                      />
                      <NumberInput
                        value={formData.dimensions.width}
                        onChange={(value) => handleNestedFieldChange('dimensions', 'width', value)}
                        placeholder="너비"
                        decimals={1}
                        min={0}
                      />
                      <NumberInput
                        value={formData.dimensions.height}
                        onChange={(value) => handleNestedFieldChange('dimensions', 'height', value)}
                        placeholder="높이"
                        decimals={1}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측 열 - 가격 및 재고 정보 */}
              <div className="space-y-6">
                {/* 가격 정보 (단일 품목인 경우만) */}
                {productType === 'single' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      가격 정보
                    </h3>

                  {/* 판매가 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      판매가 <span className="text-red-500">*</span>
                    </label>
                    <NumberInput
                      value={formData.price}
                      onChange={(value) => handleFieldChange('price', value)}
                      placeholder="0"
                      currency={true}
                      error={errors.price}
                      min={0}
                    />
                  </div>

                  {/* 소비자가 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소비자가</label>
                    <NumberInput
                      value={formData.consumerPrice}
                      onChange={(value) => handleFieldChange('consumerPrice', value)}
                      placeholder="0"
                      currency={true}
                      min={0}
                    />
                  </div>

                  {/* 원가 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">원가</label>
                    <NumberInput
                      value={formData.cost}
                      onChange={(value) => handleFieldChange('cost', value)}
                      placeholder="0"
                      currency={true}
                      min={0}
                    />
                  </div>
                  </div>
                )}

                {/* 재고 정보 (단일 품목인 경우만) */}
                {productType === 'single' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      재고 정보
                    </h3>

                  {/* 현재 재고 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      현재 재고 <span className="text-red-500">*</span>
                    </label>
                    <NumberInput
                      value={formData.currentStock}
                      onChange={(value) => handleFieldChange('currentStock', value)}
                      placeholder="0"
                      min={0}
                      error={errors.currentStock}
                    />
                  </div>

                  {/* 최소 재고 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최소 재고</label>
                    <NumberInput
                      value={formData.minStock}
                      onChange={(value) => handleFieldChange('minStock', value)}
                      placeholder="0"
                      min={0}
                    />
                  </div>

                  {/* 최대 재고 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최대 재고</label>
                    <NumberInput
                      value={formData.maxStock}
                      onChange={(value) => handleFieldChange('maxStock', value)}
                      placeholder="제한 없음"
                      min={0}
                    />
                  </div>
                  </div>
                )}

                {/* 상품 상태 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    상품 상태
                  </h3>

                  {/* 상태 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="discontinued">단종</option>
                      <option value="out_of_stock">품절</option>
                    </select>
                  </div>

                  {/* 체크박스들 */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">활성 상품</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">추천 상품</span>
                    </label>
                  </div>

                  {/* 출시일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">출시일</label>
                    <input
                      type="date"
                      value={formData.launchDate}
                      onChange={(e) => handleFieldChange('launchDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    />
                  </div>
                </div>

                {/* 상품 설명 */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    상품 설명
                  </h3>

                  {/* 간단 설명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">간단 설명</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      placeholder="상품에 대한 간단한 설명을 입력하세요"
                    />
                  </div>

                  {/* 상세 사양 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상세 사양</label>
                    <textarea
                      value={formData.specifications}
                      onChange={(e) => handleFieldChange('specifications', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      placeholder="상품의 상세 사양을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 제출 에러 */}
            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || codeChecking}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                저장 중...
              </div>
            ) : (
              '상품 추가'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAddModal; 