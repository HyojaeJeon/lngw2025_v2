'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/useToast';
import { 
  GET_CUSTOMER_DETAIL, 
  UPDATE_CUSTOMER, 
  GET_CUSTOMER_ACTIVITIES,
  GET_CUSTOMER_VOCS 
} from '@/lib/graphql/customerOperations';
import { 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  User,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Star,
  Users,
  Facebook,
  Instagram
} from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const customerId = params.id;

  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const { data: customerData, loading, error, refetch } = useQuery(GET_CUSTOMER_DETAIL, {
    variables: { id: customerId },
    errorPolicy: 'all'
  });

  const { data: activitiesData } = useQuery(GET_CUSTOMER_ACTIVITIES, {
    variables: { filter: { customerId } },
    errorPolicy: 'all'
  });

  const { data: vocsData } = useQuery(GET_CUSTOMER_VOCS, {
    variables: { filter: { customerId } },
    errorPolicy: 'all'
  });

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER, {
    onCompleted: () => {
      toast({
        title: t('customers.updateSuccess'),
        description: t('customers.updateSuccessDesc'),
      });
      setIsEditMode(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (customerData?.customer) {
      setEditData(customerData.customer);
    }
  }, [customerData]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      await updateCustomer({
        variables: {
          id: customerId,
          input: {
            name: editData.name,
            contactName: editData.contactName,
            email: editData.email,
            phone: editData.phone,
            industry: editData.industry,
            companyType: editData.companyType,
            grade: editData.grade,
            address: editData.address,
            facebook: editData.facebook,
            instagram: editData.instagram
          }
        }
      });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    setEditData(customerData.customer);
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !customerData?.customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{t('customers.loadError')}</p>
        <Button onClick={() => router.back()}>{t('common.goBack')}</Button>
      </div>
    );
  }

  const customer = customerData.customer;
  const activities = activitiesData?.customerActivities || [];
  const vocs = vocsData?.vocs || [];

  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>{t('common.back')}</span>
          </Button>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <Badge className={getGradeBadgeColor(customer.grade)}>
            {customer.grade}
          </Badge>
          <Badge className={getStatusBadgeColor(customer.status)}>
            {t(`customers.status.${customer.status}`)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          {!isEditMode ? (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>{t('common.edit')}</span>
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave}>
                {t('common.save')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 기본 정보 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>{t('customers.basicInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('customers.companyName')}</Label>
                  {isEditMode ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customer.name}</p>
                  )}
                </div>

                <div>
                  <Label>{t('customers.contactPerson')}</Label>
                  {isEditMode ? (
                    <Input
                      value={editData.contactName || ''}
                      onChange={(e) => setEditData({...editData, contactName: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customer.contactName}</p>
                  )}
                </div>

                <div>
                  <Label>{t('customers.industry')}</Label>
                  {isEditMode ? (
                    <Input
                      value={editData.industry || ''}
                      onChange={(e) => setEditData({...editData, industry: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customer.industry}</p>
                  )}
                </div>

                <div>
                  <Label>{t('customers.companyType')}</Label>
                  {isEditMode ? (
                    <Input
                      value={editData.companyType || ''}
                      onChange={(e) => setEditData({...editData, companyType: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customer.companyType}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>{t('customers.address')}</Label>
                {isEditMode ? (
                  <Input
                    value={editData.address || ''}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.address}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 정보 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>{t('customers.contactInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('customers.phone')}</Label>
                {isEditMode ? (
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <Label>{t('customers.email')}</Label>
                {isEditMode ? (
                  <Input
                    value={editData.email || ''}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-medium flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </p>
                )}
              </div>

              <div>
                <Label>{t('customers.socialMedia')}</Label>
                <div className="space-y-2">
                  {isEditMode ? (
                    <>
                      <Input
                        placeholder="Facebook"
                        value={editData.facebook || ''}
                        onChange={(e) => setEditData({...editData, facebook: e.target.value})}
                      />
                      <Input
                        placeholder="Instagram"
                        value={editData.instagram || ''}
                        onChange={(e) => setEditData({...editData, instagram: e.target.value})}
                      />
                    </>
                  ) : (
                    <>
                      {customer.facebook && (
                        <p className="text-sm flex items-center space-x-2">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          <span>{customer.facebook}</span>
                        </p>
                      )}
                      {customer.instagram && (
                        <p className="text-sm flex items-center space-x-2">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          <span>{customer.instagram}</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>{t('customers.assignedUser')}</Label>
                <p className="text-sm font-medium flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{customer.assignedUser?.name || t('common.unassigned')}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 탭 섹션 */}
      <Card>
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t('customers.contacts')}</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{t('customers.activities')}</span>
            </TabsTrigger>
            <TabsTrigger value="vocs" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>{t('customers.vocs')}</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>{t('customers.opportunities')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-4">
            <div className="space-y-4">
              {customer.contacts?.length > 0 ? (
                customer.contacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.position} - {contact.department}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            {contact.phone && (
                              <span className="text-sm flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{contact.phone}</span>
                              </span>
                            )}
                            {contact.email && (
                              <span className="text-sm flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{contact.email}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{t('customers.noContacts')}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.type}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(activity.activityDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{t('customers.noActivities')}</p>
              )}
              {activities.length > 5 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/dashboard/customers/activities?customerId=${customerId}`)}
                >
                  {t('customers.viewAllActivities')}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vocs" className="mt-4">
            <div className="space-y-4">
              {vocs.length > 0 ? (
                vocs.slice(0, 5).map((voc) => (
                  <Card key={voc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{voc.title}</h4>
                          <p className="text-sm text-gray-600">{voc.type}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(voc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{voc.priority}</Badge>
                          <Badge className={
                            voc.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            voc.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {t(`voc.status.${voc.status}`)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{t('customers.noVocs')}</p>
              )}
              {vocs.length > 5 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/dashboard/customers/voc?customerId=${customerId}`)}
                >
                  {t('customers.viewAllVocs')}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-4">
            <div className="space-y-4">
              {customer.opportunities?.length > 0 ? (
                customer.opportunities.map((opportunity) => (
                  <Card key={opportunity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{opportunity.title}</h4>
                          <p className="text-sm text-gray-600">{opportunity.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm">
                              {t('sales.expectedAmount')}: ${opportunity.expectedAmount?.toLocaleString()}
                            </span>
                            <span className="text-sm">
                              {t('sales.probability')}: {opportunity.probability}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge variant="outline">{opportunity.stage}</Badge>
                          <Badge className={
                            opportunity.priority === 'high' ? 'bg-red-100 text-red-800' :
                            opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {opportunity.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{t('customers.noOpportunities')}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}