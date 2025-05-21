
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDashboard } from '@/context/DashboardContext';

interface AddRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMotiusAsk?: boolean;
}

interface FormValues {
  requestText: string;
  personName: string;
  email: string;
  note: string;
  date: string;
}

const AddRequestDialog: React.FC<AddRequestDialogProps> = ({ 
  open, 
  onOpenChange, 
  isMotiusAsk = false 
}) => {
  const { addNewRequest, addMotiusAsk } = useDashboard();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      requestText: '',
      personName: isMotiusAsk ? 'Motius Team' : '',
      email: isMotiusAsk ? 'team@motius.com' : '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    }
  });
  
  const onSubmit = (data: FormValues) => {
    if (isMotiusAsk) {
      addMotiusAsk(data);
    } else {
      addNewRequest(data);
    }
    reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isMotiusAsk ? 'Add Motius Ask' : 'Add New Request'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestText">Request</Label>
            <Input 
              id="requestText"
              {...register('requestText', { required: 'Request text is required' })}
              placeholder="Enter request details"
            />
            {errors.requestText && <p className="text-red-500 text-xs">{errors.requestText.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personName">Name</Label>
            <Input 
              id="personName"
              {...register('personName', { required: 'Name is required' })}
              placeholder="Enter name"
            />
            {errors.personName && <p className="text-red-500 text-xs">{errors.personName.message}</p>}
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
          
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea 
              id="note"
              {...register('note')}
              placeholder="Enter additional notes"
              className="resize-none h-20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
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

export default AddRequestDialog;
