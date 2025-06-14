
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from '../../../hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { LoadingModal } from '../../../components/ui/LoadingModal';
import { GET_EMPLOYEES, GET_EMPLOYEE_STATS } from '../../../lib/graphql/employeeOperations';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../../../lib/graphql/employeeOperations';
import { notifySuccess, notifyError } from '../../../utils/notifications';
import { PlusIcon, SearchIcon, UsersIcon, UserCheckIcon, ClockIcon, CalendarIcon } from 'lucide-react';

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // GraphQL 쿼리
  const { data: employeesData, loading: employeesLoading, refetch: refetchEmployees } = useQuery(GET_EMPLOYEES, {
    variables: {
      filter: {
        search: searchTerm || undefined,
        ...filters
      },
      limit: 50,
      offset: 0
    },
    fetchPolicy: 'cache-and-network'
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_EMPLOYEE_STATS, {
    fetchPolicy: 'cache-and-network'
  });

  // 뮤테이션
  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      notifySuccess(t('직원이 성공적으로 등록되었습니다'));
      setIsCreateModalOpen(false);
      refetchEmployees();
    },
    onError: (error) => {
      notifyError(error.message);
    }
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      notifySuccess(t('직원 정보가 성공적으로 수정되었습니다'));
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      refetchEmployees();
    },
    onError: (error) => {
      notifyError(error.message);
    }
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      notifySuccess(t('직원이 성공적으로 삭제되었습니다'));
      refetchEmployees();
    },
    onError: (error) => {
      notifyError(error.message);
    }
  });

  const employees = employeesData?.employees || [];
  const stats = statsData?.employeeStats || {};

  const handleCreateEmployee = async (formData) => {
    try {
      await createEmployee({
        variables: {
          input: formData
        }
      });
    } catch (error) {
      console.error('직원 생성 오류:', error);
    }
  };

  const handleUpdateEmployee = async (formData) => {
    try {
      await updateEmployee({
        variables: {
          id: selectedEmployee.id,
          input: formData
        }
      });
    } catch (error) {
      console.error('직원 수정 오류:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm(t('정말로 이 직원을 삭제하시겠습니까?'))) {
      try {
        await deleteEmployee({
          variables: { id: employeeId }
        });
      } catch (error) {
        console.error('직원 삭제 오류:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      ON_LEAVE: 'bg-yellow-100 text-yellow-800',
      TERMINATED: 'bg-red-100 text-red-800',
      PENDING: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      ACTIVE: t('재직중'),
      ON_LEAVE: t('휴직중'),
      TERMINATED: t('퇴사'),
      PENDING: t('대기중')
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const typeColors = {
      FULL_TIME: 'bg-blue-100 text-blue-800',
      CONTRACT: 'bg-purple-100 text-purple-800',
      INTERN: 'bg-orange-100 text-orange-800',
      FREELANCER: 'bg-pink-100 text-pink-800',
      PART_TIME: 'bg-cyan-100 text-cyan-800'
    };

    const typeLabels = {
      FULL_TIME: t('정규직'),
      CONTRACT: t('계약직'),
      INTERN: t('인턴'),
      FREELANCER: t('프리랜서'),
      PART_TIME: t('파트타임')
    };

    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
        {typeLabels[type] || type}
      </Badge>
    );
  };

  if (employeesLoading && !employeesData) {
    return <LoadingModal isOpen={true} message={t('직원 정보를 불러오는 중...')} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('직원 관리')}</h1>
          <p className="text-gray-600 mt-1">{t('직원 정보를 관리하고 현황을 확인하세요')}</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('직원 등록')}
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('전체 직원')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('재직 중')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('오늘 출근')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAttendance || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('휴가 신청')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaveRequests || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('이름, 이메일, 사원번호로 검색...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select onValueChange={(value) => setFilters({ ...filters, department: value === 'all' ? undefined : value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('부서')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('전체 부서')}</SelectItem>
                <SelectItem value="개발팀">{t('개발팀')}</SelectItem>
                <SelectItem value="영업팀">{t('영업팀')}</SelectItem>
                <SelectItem value="마케팅팀">{t('마케팅팀')}</SelectItem>
                <SelectItem value="인사팀">{t('인사팀')}</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setFilters({ ...filters, employmentStatus: value === 'all' ? undefined : value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('상태')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('전체 상태')}</SelectItem>
                <SelectItem value="ACTIVE">{t('재직중')}</SelectItem>
                <SelectItem value="ON_LEAVE">{t('휴직중')}</SelectItem>
                <SelectItem value="TERMINATED">{t('퇴사')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 직원 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('직원 목록')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">{t('프로필')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('사원번호')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('부서/직책')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('고용형태')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('상태')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('입사일')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('작업')}</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{employee.fullName}</p>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">{employee.employeeNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{employee.department}</p>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getEmploymentTypeBadge(employee.employmentType)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(employee.employmentStatus)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {new Date(employee.hireDate).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsEditModalOpen(true);
                          }}
                        >
                          {t('수정')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {t('삭제')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 직원 등록 모달 */}
      <EmployeeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEmployee}
        title={t('새 직원 등록')}
      />

      {/* 직원 수정 모달 */}
      {selectedEmployee && (
        <EmployeeFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          onSubmit={handleUpdateEmployee}
          employee={selectedEmployee}
          title={t('직원 정보 수정')}
        />
      )}
    </div>
  );
}

// 직원 폼 모달 컴포넌트
function EmployeeFormModal({ isOpen, onClose, onSubmit, employee, title }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    email: '',
    phone: '',
    mobile: '',
    department: '',
    position: '',
    jobTitle: '',
    employmentType: 'FULL_TIME',
    employmentStatus: 'ACTIVE',
    hireDate: '',
    birthDate: '',
    gender: '',
    nationality: '',
    address: '',
    baseSalary: '',
    salaryType: 'MONTHLY',
    bankAccount: '',
    bankName: '',
    notes: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeNumber: employee.employeeNumber || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        firstNameEn: employee.firstNameEn || '',
        lastNameEn: employee.lastNameEn || '',
        email: employee.email || '',
        phone: employee.phone || '',
        mobile: employee.mobile || '',
        department: employee.department || '',
        position: employee.position || '',
        jobTitle: employee.jobTitle || '',
        employmentType: employee.employmentType || 'FULL_TIME',
        employmentStatus: employee.employmentStatus || 'ACTIVE',
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : '',
        gender: employee.gender || '',
        nationality: employee.nationality || '',
        address: employee.address || '',
        baseSalary: employee.baseSalary || '',
        salaryType: employee.salaryType || 'MONTHLY',
        bankAccount: employee.bankAccount || '',
        bankName: employee.bankName || '',
        notes: employee.notes || ''
      });
    } else {
      setFormData({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        firstNameEn: '',
        lastNameEn: '',
        email: '',
        phone: '',
        mobile: '',
        department: '',
        position: '',
        jobTitle: '',
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        hireDate: '',
        birthDate: '',
        gender: '',
        nationality: '',
        address: '',
        baseSalary: '',
        salaryType: 'MONTHLY',
        bankAccount: '',
        bankName: '',
        notes: ''
      });
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = { ...formData };
    
    // 빈 문자열을 null로 변환
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '') {
        submitData[key] = null;
      }
    });

    // 숫자 필드 변환
    if (submitData.baseSalary) {
      submitData.baseSalary = parseFloat(submitData.baseSalary);
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('기본 정보')}</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('사원번호')} *</label>
                <Input
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('성')} *</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('이름')} *</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('영문 성')}</label>
                  <Input
                    value={formData.lastNameEn}
                    onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('영문 이름')}</label>
                  <Input
                    value={formData.firstNameEn}
                    onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('이메일')} *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('전화번호')}</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('휴대폰')}</label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 직장 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('직장 정보')}</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('부서')} *</label>
                <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('부서 선택')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="개발팀">{t('개발팀')}</SelectItem>
                    <SelectItem value="영업팀">{t('영업팀')}</SelectItem>
                    <SelectItem value="마케팅팀">{t('마케팅팀')}</SelectItem>
                    <SelectItem value="인사팀">{t('인사팀')}</SelectItem>
                    <SelectItem value="재무팀">{t('재무팀')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('직책')} *</label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('고용형태')} *</label>
                <Select onValueChange={(value) => setFormData({ ...formData, employmentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('고용형태 선택')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">{t('정규직')}</SelectItem>
                    <SelectItem value="CONTRACT">{t('계약직')}</SelectItem>
                    <SelectItem value="INTERN">{t('인턴')}</SelectItem>
                    <SelectItem value="FREELANCER">{t('프리랜서')}</SelectItem>
                    <SelectItem value="PART_TIME">{t('파트타임')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('근무상태')} *</label>
                <Select onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('근무상태 선택')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">{t('재직중')}</SelectItem>
                    <SelectItem value="ON_LEAVE">{t('휴직중')}</SelectItem>
                    <SelectItem value="TERMINATED">{t('퇴사')}</SelectItem>
                    <SelectItem value="PENDING">{t('대기중')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('입사일')} *</label>
                <Input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('기본급')}</label>
                <Input
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('취소')}
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {employee ? t('수정') : t('등록')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
