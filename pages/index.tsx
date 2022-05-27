import { useState } from 'react'

import type { NextPage } from 'next'

function getDate(date: string) {
  const slicedDate = date.split('/')
  const formattedDate = [
    slicedDate[1],
    slicedDate[0],
    slicedDate[2]
  ].join('/')
  const newDate = new Date(formattedDate)
  
  return newDate.toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
}

function getCategory(description: string, type: string) {
  let category = 'Other'

  if(description.includes('UBER')) {
    category = 'Uber'
  }

  if(description.includes('UE *COSTA RICA')) {
    category = 'Uber Eats'
  }

  if(type === 'TF') {
    category = 'Transferencia'
  }

  if(type === 'AT') {
    category = 'Retiro'
  }

  return category
}

function getTotal(expenses: any) {
  return expenses.reduce((acc: number, exp: any) => acc + parseFloat(exp.amount), 0)
}

const Home: NextPage = () => {
  const [file, setFile] = useState()
  const [expenses, setExpenses] = useState([])

  const handleAddFile = (e: any) => {
    e.preventDefault()
    console.log('Adding file')
    setFile(e.target.files[0])
  }

  const handleAddExpenses = (e: any) => {
    const fileReader = new FileReader();
    e.preventDefault()
    console.log('Reading Expenses')
  
    if (file) {
      fileReader.onload = function (event) {
        const text: any = event?.target?.result ?? ''
        const slicedText = text.split('\n')
        const isolatedExpenses = slicedText.slice(5, slicedText.length - 12)
        const parsedExpenses = isolatedExpenses.map((expense: string) => {
          const slicedExpense = expense.split(',').map(exp => exp.trim())
          return {
            amount: slicedExpense[4],
            category: getCategory(slicedExpense[3], slicedExpense[2]),
            date: getDate(slicedExpense[0]),
            description: slicedExpense[3],
            id: slicedExpense[1],
            type: slicedExpense[2]
          }
        })

        console.log(parsedExpenses)
        setExpenses(parsedExpenses)
      };

      fileReader.readAsText(file)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-5 flex flex-col">
      <h1 className="text-6xl font-bold mb-4">Pithaya: Expense Visualizer</h1>
      <input className="mb-2" type="file" id="csvFile" accept=".csv" onChange={handleAddFile} />
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline"
        onClick={handleAddExpenses}
      >
          Add Expenses
      </button>

      <div className="mt-10">
        {expenses.length === 0 ? (
          <div>
            No Expenses found
          </div>
        ) : (
          <div>
            <p>Total: $ {getTotal(expenses)}</p>
            <table className="table-auto">
              <thead>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </thead>
              <tbody>
                {expenses.map((expense: any, index) => (
                  <tr key={`${index}-${expense.description}`}>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>$ {expense.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
