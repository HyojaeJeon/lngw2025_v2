
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Badge } from '../../../../components/ui/badge.js'
import { 
  Settings, 
  Building, 
  Calculator, 
  Globe, 
  Shield, 
  Database,
  CheckCircle,
  XCircle,
  TestTube
} from 'lucide-react'
import { useLanguage } from '../../../../contexts/languageContext.js'

export default function AccountingSetupPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('basic')

  const tabs = [
    { id: 'basic', name: t('accounting.basicInfo'), icon: Building },
    { id: 'accounting', name: t('accounting.chartOfAccounts'), icon: Calculator },
    { id: 'tax', name: t('accounting.taxSettings'), icon: Globe },
    { id: 'security', name: t('accounting.securitySettings'), icon: Shield },
    { id: 'integration', name: t('accounting.integrations'), icon: Database },
  ]

  // 샘플 데이터
  const companyInfo = {
    companyName: 'LN Partners Vietnam',
    taxCode: '1234567890',
    address: 'Ho Chi Minh City, Vietnam',
    fiscalYear: '2025-01-01 ~ 2025-12-31',
    currency: 'VND',
    representative: 'Nguyen Van A'
  }

  const chartOfAccounts = [
    { code: '111', name: '현금', category: '자산', active: true },
    { code: '112', name: '은행예금', category: '자산', active: true },
    { code: '211', name: '매입채무', category: '부채', active: true },
    { code: '311', name: '자본금', category: '자본', active: true },
    { code: '411', name: '매출', category: '수익', active: true },
    { code: '511', name: '매출원가', category: '비용', active: true },
  ]

  const taxSettings = [
    { name: 'VAT 10%', rate: 10, active: true },
    { name: 'VAT 5%', rate: 5, active: true },
    { name: 'VAT 0%', rate: 0, active: true },
    { name: '면세', rate: 0, active: false },
  ]

  const integrationServices = [
    { name: 'MISA', type: '회계 시스템', status: 'connected', lastSync: '2024-01-15 09:30' },
    { name: 'Viettel eInvoice', type: '전자세금계산서', status: 'error', lastSync: '2024-01-14 15:20' },
    { name: 'MB Bank API', type: '은행 연동', status: 'connected', lastSync: '2024-01-15 08:45' },
    { name: 'Vietcombank API', type: '은행 연동', status: 'disconnected', lastSync: 'Never' },
  ]

  const apiServices = [
    { name: 'Facebook API', status: 'connected', apiKey: '••••••••••••••••', lastSync: '2024-01-15 10:30' },
    { name: 'TikTok API', status: 'connected', apiKey: '••••••••••••••••', lastSync: '2024-01-15 10:25' },
    { name: 'Google Sheets API', status: 'error', apiKey: '••••••••••••••••', lastSync: '2024-01-14 16:20' },
    { name: 'Cloudinary API', status: 'connected', apiKey: '••••••••••••••••', lastSync: '2024-01-15 09:45' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.companyInfo')}</CardTitle>
                <CardDescription>{t('accounting.setup.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('accounting.companyName')}</label>
                    <Input value={companyInfo.companyName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('accounting.taxCode')} (Mã số thuế)</label>
                    <Input value={companyInfo.taxCode} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('accounting.address')}</label>
                    <Input value={companyInfo.address} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('accounting.representative')}</label>
                    <Input value={companyInfo.representative} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('accounting.fiscalYear')}</label>
                    <Input value={companyInfo.fiscalYear} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('accounting.currency')}</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="VND">VND (베트남 동)</option>
                      <option value="USD">USD (미국 달러)</option>
                      <option value="KRW">KRW (한국 원)</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">{t('accounting.save')}</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'accounting':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.chartOfAccounts')}</CardTitle>
                <CardDescription>{t('accounting.coaDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{t('accounting.chartOfAccounts')}</h3>
                    <Button size="sm">+ {t('accounting.addAccount')}</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-2">{t('accounting.accountCode')}</th>
                          <th className="text-left p-2">{t('accounting.accountName')}</th>
                          <th className="text-left p-2">{t('accounting.category')}</th>
                          <th className="text-left p-2">{t('accounting.status')}</th>
                          <th className="text-left p-2">{t('accounting.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartOfAccounts.map((account, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-2 font-mono">{account.code}</td>
                            <td className="p-2">{account.name}</td>
                            <td className="p-2">{account.category}</td>
                            <td className="p-2">
                              <Badge variant={account.active ? 'default' : 'secondary'}>
                                {account.active ? t('accounting.active') : t('accounting.inactive')}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Button variant="outline" size="sm">{t('accounting.edit')}</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tax':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>세금 설정</CardTitle>
                <CardDescription>{t('accounting.taxSettingsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('accounting.vatSettingsTitle')}</h3>
                  {taxSettings.map((tax, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{tax.name}</span>
                        <span className="text-gray-500 ml-2">({tax.rate}%)</span>
                      </div>
                      <Badge variant={tax.active ? 'default' : 'secondary'}>
                        {tax.active ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  ))}
                  <Button className="w-full">+ {t('accounting.addNewTaxType')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>{t('accounting.securitySettingsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">관리자 이메일</label>
                  <Input placeholder="admin@company.com" />
                </div>
                <div>
                  <label className="text-sm font-medium">Webhook 검증 토큰</label>
                  <Input placeholder="웹훅 검증용 토큰을 입력하세요" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="2fa" />
                  <label htmlFor="2fa" className="text-sm">2단계 인증 활성화</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="ip-whitelist" />
                  <label htmlFor="ip-whitelist" className="text-sm">IP 화이트리스트 사용</label>
                </div>
                <Button className="w-full">보안 설정 저장</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>외부 시스템 연동</CardTitle>
                <CardDescription>{t('accounting.integrationsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.type}</div>
                        <div className="text-xs text-gray-400">{t('accounting.lastSync')}: {service.lastSync}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.status === 'connected' ? 'default' : service.status === 'error' ? 'destructive' : 'secondary'}>
                          {service.status === 'connected' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : service.status === 'error' ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : null}
                          {service.status === 'connected' ? t('accounting.connected') : service.status === 'error' ? t('accounting.error') : t('accounting.disconnected')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <TestTube className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API 키 관리</CardTitle>
                <CardDescription>{t('accounting.apiKeyDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiServices.map((api, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{api.name}</span>
                        <Badge variant={api.status === 'connected' ? 'default' : 'destructive'}>
                          {api.status === 'connected' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {api.status === 'connected' ? t('accounting.normal') : t('accounting.error')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">{t('accounting.apiKey')}</label>
                          <Input 
                            type="password" 
                            value={api.apiKey} 
                            placeholder={t('accounting.enterApiKey')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">{t('accounting.lastSync')}</label>
                          <Input value={api.lastSync} disabled />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                      rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                       bg-clip-text text-transparent">
          {t('accounting.setup')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t('accounting.setupDescription')}
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      {renderTabContent()}
    </div>
  );
}
