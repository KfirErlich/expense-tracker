import type { BudgetData } from "../types/tablesDef"

import { MONTH_NAMES } from "../types/tablesDef"

export const Table = ({ budgetData }: { budgetData: BudgetData }) => {
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
                    {budgetData.map((row) => (
                        <tr key={row.id}>
                            <td className="border border-gray-300 p-2 font-bold bg-gray-50">
                                {row.name}
                            </td>
                            {row.monthly_data.map((amount, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-right">
                                    {amount}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}   
export default Table