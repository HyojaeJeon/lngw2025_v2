
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.js'
import { Badge } from '../../../components/ui/badge.js'
import { Button } from '../../../components/ui/button.js'
import { useLanguage } from '../../../contexts/languageContext.js'
import { 
  Calculator, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
  PieChart
} from 'lucide-react'

export default function AccountingDashboardPage() {
  const { t, language } = useLanguage()
  const [period, setPeriod] = useState('month')

  // 회계 대시보드 데이터
  const dashboardData = {
    summary: {
      totalRevenue: 45678900,
      totalExpenses: 23456789,
      netProfit: 22222111,
      profitMargin: 48.7
    },
    pending: {
      pendingVouchers: 12,
      pendingApprovals: 8,
      overduePayments: 3
    },
    recent: {
      transactions: [
        { id: 1, date: '2024-01-15', description: t('accounting.transaction.advertisingExpense'), amount: -1500000, type: 'expense' },
        { id: 2, date: '2024-01-14', description: t('accounting.transaction.productSalesRevenue'), amount: 3200000, type: 'revenue' },
        { id: 3, date: '2024-01-13', description: t('accounting.transaction.officeSuppliesPurchase'), amount: -450000, type: 'expense' },
        { id: 4, date: '2024-01-12', description: t('accounting.transaction.consultingRevenue'), amount: 2800000, type: 'revenue' },
      ]
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const quickActions = [
    { name: t('accounting.voucher'), href: '/dashboard/accounting/voucher', icon: FileText, color: 'bg-blue-500' },
    { name: t('accounting.statements'), href: '/dashboard/accounting/statements', icon: PieChart, color: 'bg-green-500' },
    { name: t('accounting.budget'), href: '/dashboard/accounting/budget', icon: TrendingUp, color: 'bg-purple-500' },
    { name: t('accounting.tax'), href: '/dashboard/accounting/tax', icon: Calculator, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                         bg-clip-text text-transparent">
            {t('accounting.dashboard')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('accounting.dashboard.description')}
          </p>
          
          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
            >
              {t('common.weekly')}
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('month')}
            >
              {t('common.monthly')}
            </Button>
            <Button
              variant={period === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('quarter')}
            >
              {t('common.quarterly')}
            </Button>
          </div>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('accounting.totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.summary.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('accounting.previousMonth')} +12.5%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('accounting.totalExpenses')}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData.summary.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('accounting.previousMonth')} +5.2%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('accounting.netProfit')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(dashboardData.summary.netProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('accounting.previousMonth')} +18.7%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('accounting.profitMargin')}</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.summary.profitMargin}%
              </div>
              <p className="text-xs text-muted-foreground">
                {t('accounting.previousMonth')} +2.1%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 빠른 작업 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('accounting.quickActions')}</CardTitle>
              <CardDescription>
                {t('accounting.quickActionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <Button variant="ghost" className="justify-start flex-1 h-auto p-2">
                    <span className="text-sm font-medium">{action.name}</span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 대기 중인 작업 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('accounting.pendingTasks')}</CardTitle>
              <CardDescription>
                {t('accounting.pendingTasksDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    {t('accounting.pendingVouchers')}
                  </span>
                </div>
                <Badge variant="secondary">{dashboardData.pending.pendingVouchers}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {t('accounting.pendingApproval')}
                  </span>
                </div>
                <Badge variant="secondary">{dashboardData.pending.pendingApprovals}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    {t('accounting.overduePayments')}
                  </span>
                </div>
                <Badge variant="destructive">{dashboardData.pending.overduePayments}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 최근 거래 내역 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('accounting.recentTransactions')}</CardTitle>
              <CardDescription>
                {t('accounting.recentTransactionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.recent.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

  )
}
