import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { postAssignmentSolution } from '../../features/AsyncSlices/StudentSlice'

export default function SolutionSection({ assignment, subCode, students, user }) {
    const dispatch = useDispatch();
    const [solutionText, setSolutionText] = useState('')
    const currentStudent = students.find(st => st.code === user.code)
    const currentSol = currentStudent?.solutions?.find(s => s.id === Number(assignment.id))

    const handleSend = () => {
        if (!solutionText) return alert("يرجى كتابة الحل");
        dispatch(postAssignmentSolution({ id: assignment.id, title: solutionText, subCode, solvedAt: Date.now() }))
        window.location.reload()
    }

    return (
        <div className="border-t pt-6 text-right">
            {currentSol ? (
                <div className="bg-green-50 p-4 rounded-xl text-green-700 font-bold border border-green-100">
                    تم إرسال الحل: {currentSol.title}
                </div>
            ) : (
                <div className="space-y-3">
                    <h3 className="font-bold text-[#303972]">حل الواجب:</h3>
                    <textarea
                        className="w-full border p-4 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#4D44B5] outline-none transition"
                        rows={4}
                        value={solutionText}
                        onChange={e => setSolutionText(e.target.value)}
                        placeholder="اكتب حلك هنا..."
                    />
                    <button onClick={handleSend} className="w-full py-3 bg-[#4D44B5] text-white rounded-xl font-bold transition hover:bg-[#3c358b]">إرسال الحل</button>
                </div>
            )}
        </div>
    )
}