import { useParams } from 'react-router-dom';
import EmployeeForm from '../components/employee_form';

function EditEmployee() {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Employee</h1>
      <EmployeeForm editId={id} />
    </div>
  );
}

export default EditEmployee;
