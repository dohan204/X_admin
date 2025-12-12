import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Typography,
} from "@mui/material";
import { type AddPermissionProps } from "./genericModel";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import DialogDetailsRolePermission from './rolePermission/DetailsPermission'
export default function AddPermisstionToRole({ openAddPermission, handleCloseAddPermission, roles }: AddPermissionProps) {
  const [openDetailsPermission, setOpenDetailsPermission] = useState(false)
  const [roleId, setRoleId] = useState<string>('')
  const handleOpenDetailsPermission = (id: string) => {
    setOpenDetailsPermission(true)
    setRoleId(id)
  }
  const handleCloseDetailsPermission = () => setOpenDetailsPermission(false)
    return (
        <Box>
            <Dialog open={openAddPermission} sx={{ display: 'flex',
                 justifyContent: 'center', alignContent: 'center'}}>
                <DialogTitle>
                    <Typography variant="h3" component={'h3'} color="secondary">
                        Thêm quyền
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {roles.map((role) => (
                        <Accordion key={role.id} sx={{width: 400}}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                {role.name}
                            </AccordionSummary>
                            <AccordionActions>
                              <Button onClick={() => handleOpenDetailsPermission(role.id)}>
                                Chi tiết
                              </Button>
                            </AccordionActions>
                        </Accordion>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddPermission}>
                        Ok
                    </Button>
                    <Button onClick={handleCloseAddPermission}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
            <DialogDetailsRolePermission open={openDetailsPermission} 
              handleClose={handleCloseDetailsPermission}
              roleId={roleId}
            />
        </Box>
    )
} 
