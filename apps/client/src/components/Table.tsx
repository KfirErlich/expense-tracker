import type { BudgetData } from "../types/tablesDef"
import React from "react"

import { MONTH_NAMES } from "../types/tablesDef"
import { CellComponent } from "./Cell"

type HandleUpdateCell = (rowId: string, monthIndex: number, value: number) => void

export const TableComponent = ({ budgetData, handleUpdateCell }: { budgetData: BudgetData, handleUpdateCell: HandleUpdateCell }) => {
    // Calculate the sum for each month column
    const monthlySums = MONTH_NAMES.map((_, monthIndex) => {
        return budgetData.reduce((sum, row) => sum + (row.monthly_data[monthIndex] || 0), 0)
    })

    // Calculate the average of monthly sums for the summary row
    const averageOfSums = monthlySums.reduce((sum, val) => sum + val, 0) / MONTH_NAMES.length

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
                        <th className="border border-gray-300 p-2 text-center bg-gray-100">
                            Average
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {budgetData.map((row) => {
                        // Calculate average for each row
                        const rowAverage = row.monthly_data.reduce((sum, val) => sum + val, 0) / row.monthly_data.length
                        return (
                            <tr key={row.id}>
                                <td className="border border-gray-300 p-2 font-bold bg-gray-50">
                                    {row.name}
                                </td>
                                {row.monthly_data.map((amount, monthIndex) => (
                                    <CellComponent key={monthIndex} row={row} amount={amount} monthIndex={monthIndex} handleUpdateCell={handleUpdateCell} />
                                ))}
                                <td className="border border-gray-300 p-2 text-center font-bold bg-gray-50">
                                    {`${rowAverage.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                                </td>
                            </tr>
                        )
                    })}
                    {/* Summary row */}
                    <tr className="bg-blue-50">
                        <td className="border border-gray-300 p-2 font-bold bg-blue-100">
                            Total
                        </td>
                        {monthlySums.map((sum, monthIndex) => (
                            <td key={monthIndex} className="border border-gray-300 p-2 text-center font-bold bg-blue-100">
                                {sum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                            </td>
                        ))}
                        <td className="border border-gray-300 p-2 text-center font-bold bg-blue-100">
                            {averageOfSums.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}   
export const Table = React.memo(TableComponent)
export default Table