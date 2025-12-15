import { MONTH_NAMES, SUMMARY_TABLE_DATA, type SummaryTableProps } from "../types/tablesDef"
import { type MonthlySummaryData } from "../types/tablesDef"
import React from "react"


const SummaryTableComponent = ({ income, vital, nonVital }: SummaryTableProps) => {
    const calculateMonthlyData = () => {
        return MONTH_NAMES.map((_, monthIndex) => {
            const totalIncome = income.reduce((sum, row) => sum + (row.monthly_data[monthIndex] || 0), 0)
            
            const vitalExpenses = vital.reduce((sum, row) => sum + (row.monthly_data[monthIndex] || 0), 0)
            
            const nonVitalExpenses = nonVital.reduce((sum, row) => sum + (row.monthly_data[monthIndex] || 0), 0)
            
            const totalExpenses = vitalExpenses + nonVitalExpenses
            
            const balance = totalIncome - totalExpenses
            
            const savingPercentage = totalIncome !== 0 ? 1 - (totalExpenses / totalIncome) : 0
            
            return {
                totalIncome,
                vitalExpenses,
                nonVitalExpenses,
                totalExpenses,
                balance,
                savingPercentage
            }
        })
    }

    const monthlyData = calculateMonthlyData()

    const formatNumber = (value: number) => {
        return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    }

    const formatPercentage = (value: number) => {
        return `${(value * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
    }

    const getBalanceColor = (balance: number) => {
        return balance < 0 ? 'text-red-600' : 'text-green-600'
    }

    const getRowValue = (rowId: string, data: MonthlySummaryData) => {
        switch (rowId) {
            case 'Total_Income':
                return formatNumber(data.totalIncome)
            case 'Vital_Expenses':
                return formatNumber(data.vitalExpenses)
            case 'Non_Vital_Expenses':
                return formatNumber(data.nonVitalExpenses)
            case 'Total_Expenses':
                return formatNumber(data.totalExpenses)
            case 'Balance':
                return formatNumber(data.balance)
            case 'Saving_Percentage':
                return formatPercentage(data.savingPercentage)
            default:
                return ''
        }
    }

    const getRowCellClassName = (rowId: string, data: MonthlySummaryData) => {
        const baseClassName = 'border border-gray-300 p-2 text-center'
        if (rowId === 'Balance') {
            return `${baseClassName} font-bold ${getBalanceColor(data.balance)}`
        }
        return baseClassName
    }

    return (
        <div className="overflow-x-auto">
            <table className="border-collapse w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100"></th>
                        {MONTH_NAMES.map((month) => (
                            <th key={month} className="border border-gray-300 p-2 text-center bg-gray-100">
                                {month}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {SUMMARY_TABLE_DATA.map((row) => (
                        <tr key={row.id}>
                            <td className="border border-gray-300 p-2 font-bold bg-gray-50">
                                {row.name}
                            </td>
                            {monthlyData.map((data, monthIndex) => (
                                <td key={monthIndex} className={getRowCellClassName(row.id, data)}>
                                    {getRowValue(row.id, data)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export const SummaryTable = React.memo(SummaryTableComponent)
export default SummaryTable