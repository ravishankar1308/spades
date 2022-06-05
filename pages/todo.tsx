import type { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  InputBase,
  IconButton,
  ButtonGroup,
  Button,
  Typography
} from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { Card, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Loader } from '../components/Loader';

const Todo: NextPage = () => {
  const { control, handleSubmit, reset } = useForm<any>();
  const [status, setStatus] = useState<'CREATED' | 'INPROGRESS' | 'DONE'>('CREATED');

  const { data, error } = useSWR(`/api/user/todo?status=${status}`);
  const [todoList, setTodoList] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    if (data) {
      setTodoList(data);
    }
  }, [data]);

  const createTodo = (data: any) => {
    const { title } = data;
    if (title) {
      axios.post('/api/todo/create', data).then((res) => {
        if (status === 'CREATED') {
          todoList.push(res.data.data);
        }
        toast(res.data.message);
        reset({ title: '' });
      });
    }
  };

  const updateTodoStatus = (id: string, status: 'CREATED' | 'INPROGRESS' | 'DONE') => {
    axios.patch(`/api/todo/${id}`, { status }).then((res) => {
      const updatedTodo = todoList.filter((item: any) => item._id !== id);
      setTodoList(updatedTodo);
      toast(res.data.message);
    });
  };

  const deleteTodo = (id: string) => {
    axios.delete(`/api/todo/${id}`).then((res) => {
      const updatedTodo = todoList.filter((item) => item._id !== id);
      setTodoList(updatedTodo);
      toast(res.data.message);
    });
  };

  if (!todoList && !error) {
    return <Loader />;
  }

  return (
    <Grid
      item
      container
      justifyContent={'center'}
      alignSelf={'flex-start'}
      sx={{ paddingY: 10, height: '100vh' }}
    >
      <Card sx={{ p: 3 }}>
        <Grid item container>
          <Paper
            component="form"
            sx={{ p: '2px 4px', mb: 2, display: 'flex', alignItems: 'center', width: 400 }}
          >
            <Controller
              name={'title'}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputBase
                  {...field}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      handleSubmit(createTodo)();
                      e.preventDefault();
                    }
                  }}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Create Todo"
                />
              )}
            />
            <IconButton
              type={'button'}
              onClick={handleSubmit(createTodo)}
              sx={{ p: '10px' }}
              aria-label="search"
            >
              <AddCircle />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item container justifyContent={'center'}>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={() => setStatus('CREATED')}>Todo</Button>
            <Button onClick={() => setStatus('INPROGRESS')}>In Progress</Button>
            <Button onClick={() => setStatus('DONE')}>Done</Button>
          </ButtonGroup>
        </Grid>
        <Grid item container>
          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {todoList.length === 0 && <Typography>Empty Result</Typography>}
            {todoList.map((value: any) => {
              const { _id: id, title } = value;
              return (
                <ListItem
                  key={id}
                  secondaryAction={
                    status !== 'DONE' ? (
                      <Checkbox
                        title={status === 'CREATED' ? 'Move to Todo' : 'Move to Done'}
                        edge="end"
                        onChange={() => {
                          if (status === 'CREATED') {
                            updateTodoStatus(id, 'INPROGRESS');
                          } else if (status === 'INPROGRESS') {
                            updateTodoStatus(id, 'DONE');
                          }
                        }}
                        checked={false}
                      />
                    ) : (
                      <IconButton
                        title={'Delete todo'}
                        type={'button'}
                        onClick={() => deleteTodo(id)}
                        sx={{ p: '10px' }}
                        aria-label="search"
                      >
                        <Delete />
                      </IconButton>
                    )
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText id={id} primary={title} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Card>
    </Grid>
  );
};

export default Todo;
