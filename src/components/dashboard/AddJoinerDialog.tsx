
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboard } from '@/context/DashboardContext';

interface AddJoinerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  name: string;
  company: string;
  email: string;
}

const AddJoinerDialog: React.FC<AddJoinerDialogProps> = ({ open, onOpenChange }) => {
  const { addNewJoiner } = useDashboard();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: ''
    }
  });
  
  const onSubmit = (data: FormValues) => {
    addNewJoiner(data);
    reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Joiner</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter name"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company"
              {...register('company', { required: 'Company is required' })}
              placeholder="Enter company"
            />
            {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJoinerDialog;
