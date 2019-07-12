import React, { useEffect, useState } from 'react'

// start of material imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
// end of material imports

// start of sensenet imports
import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '../hooks/use-repository'
// end of sensenet imports

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
)

/**
 * Todo List
 */
const TodoListPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    /**
     * load from repo
     */
    async function loadContents() {
      const result: ODataCollectionResponse<GenericContent> = await repo.loadCollection({
        path: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/Tasks`,
        oDataOptions: {
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'Status'] as any,
          orderby: [['CreationDate', 'desc']],
          expand: ['CreatedBy'] as any,
        },
      })

      setData(result.d.results)
    }
    loadContents()
  }, [repo])

  const classes = useStyles()
  const [checked, setChecked] = React.useState([0])

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const TodoItems = data.map(d => {
    const labelId = `checkbox-list-label-${d.Id}`
    const classCompleted = d.Status == 'completed' ? 'comp' : ''

    return (
      <ListItem key={d.Id} role={undefined} dense button onClick={handleToggle(d.Id)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(d.Id) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={`${d.DisplayName}`} className={classCompleted} />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  })

  return <List className={classes.root}>{TodoItems}</List>
}

export default TodoListPanel
