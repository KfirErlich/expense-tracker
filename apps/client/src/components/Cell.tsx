import { useState, useEffect } from "react"
import type { CatagoryRow } from "../types/tablesDef"
import React from "react"

type HandleUpdateCell = (rowId: string, monthIndex: number, value: number) => void

export const CellComponent = React.memo(({ row, amount, monthIndex, handleUpdateCell }: { row: CatagoryRow, amount: number, monthIndex: number, handleUpdateCell: HandleUpdateCell }) => {
    const [inputValue, setInputValue] = useState<string>(amount.toString())
    
    // Update local state when the amount prop changes (from external updates)
    useEffect(() => {
        setInputValue(amount.toString())
    }, [amount])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value) // Allow typing/deleting characters naturally
    }
    
    const handleBlur = () => {
        // Ensure we have a valid number on blur
        const numValue = inputValue === '' ? 0 : Number(inputValue)
        if (isNaN(numValue)) {
            setInputValue('0')
            handleUpdateCell(row.id, monthIndex, 0)
        } else {
            setInputValue(numValue.toString())
            handleUpdateCell(row.id, monthIndex, numValue)
        }
    }
    
    return (
     <td className="border border-gray-300 p-2 text-right">
        <input 
        type="text"
        className="w-full text-center bg-gray-100" 
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        />
    </td>
    )
})