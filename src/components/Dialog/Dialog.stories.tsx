import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Dialog } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Built on the native `<dialog>` with `showModal()`: focus is trapped, the page behind is inert, Escape closes, and focus returns to the trigger.',
      },
    },
  },
  args: { open: false, onClose: () => {}, title: 'Dialog' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete account</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete your account?"
          description="All expenses and recurring entries will be removed. This cannot be undone."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete account</Button>
            </>
          }
        />
      </>
    );
  },
};

export const WithForm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Get in touch</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Start a project"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" form="contact">Send</Button>
            </>
          }
        >
          <form id="contact" className="sb-stack" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
            <TextField label="Name" required autoComplete="name" />
            <TextField label="Email" type="email" required autoComplete="email" />
          </form>
        </Dialog>
      </>
    );
  },
};
