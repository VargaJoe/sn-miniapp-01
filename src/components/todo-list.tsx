import React, { useEffect, useState } from 'react'

// start of material imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
// end of material imports

// start of sensenet imports
import { ODataCollectionResponse } from '@sensenet/client-core'
import { Status, Task } from '@sensenet/default-content-types'
import { useRepository } from '../hooks/use-repository'
// end of sensenet imports

// start of component imports
import NewTaskPanel from './new-task'
// end of component imports

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    listItemSecondaryAction: {
      visibility: 'hidden',
    },
    listItem: {
      '&:hover $listItemSecondaryAction': {
        visibility: 'inherit',
      },
    },
  }),
)

/**
 * Todo List
 */
const TodoListPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()
  const [data, setData] = useState<Task[]>([])

  useEffect(() => {
    /**
     * load from repo
     */
    async function loadContents() {
      const result: ODataCollectionResponse<Task> = await repo.loadCollection({
        path: `/Root/Content/IT/Tasks`,
        oDataOptions: {
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'Status'] as any,
          orderby: ['Status', ['CreationDate', 'desc']],
          expand: ['CreatedBy'] as any,
        },
      })

      setData(result.d.results)
    }
    loadContents()
  }, [repo])

  // Remove current task
  const deleteTask = async (task: Task) => {
    const newdata = [...data.filter(x => x.Id !== task.Id)]
    await repo.delete({
      idOrPath: task.Path,
      permanent: true,
    })
    setData(newdata)
  }

  const toggleTask = async (task: Task) => {
    const currentIndex = data.indexOf(task)
    const newdata = [...data]
    const newStatus = task.Status === Status.completed ? Status.active : Status.completed

    // toggle current task status
    await repo.patch<Task>({
      idOrPath: task.Path,
      content: {
        Status: newStatus,
      },
    })
    newdata[currentIndex].Status = newStatus

    // rearrange task order
    newdata.sort((a, b) => {
      const aStatus = a.Status === undefined ? Status.active : a.Status
      const bStatus = b.Status === undefined ? Status.active : b.Status
      if (aStatus == bStatus) {
        const aDate = a.CreationDate === undefined ? new Date() : new Date(a.CreationDate)
        const bDate = b.CreationDate === undefined ? new Date() : new Date(b.CreationDate)
        return aDate == bDate ? 0 : aDate < bDate ? 1 : -1
      } else {
        return aStatus > bStatus ? 1 : bStatus > aStatus ? -1 : 0
      }
    })

    // update data state
    setData(newdata)
  }

  const TodoItems = data.map(d => {
    const labelId = `checkbox-list-label-${d.Id}`
    const deleteId = `checkbox-list-deletebtn-${d.Id}`
    const classCompleted = d.Status === Status.completed ? 'comp' : ''

    return (
      <ListItem
        key={d.Id}
        role={undefined}
        dense
        button
        classes={{
          container: classes.listItem,
        }}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={d.Status == Status.completed}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={() => toggleTask(d)}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={`${d.DisplayName} / ${d.CreationDate} / ${d.Status}`}
          className={classCompleted}
        />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          <IconButton id={deleteId} edge="end" aria-label="Delete" onClick={() => deleteTask(d)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  })

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <List className={classes.root}>
          <NewTaskPanel data={data} setData={setData} />
          {TodoItems}
        </List>
      </Grid>
    </Grid>
  )
}

export default TodoListPanel
