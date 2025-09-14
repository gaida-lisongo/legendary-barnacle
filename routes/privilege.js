const express = require('express');
const router = express.Router();
const privilegeController = require('../controllers/privilegeController');

// CRUD
router.post('/', privilegeController.createPrivilege);
router.get('/', privilegeController.getPrivileges);
router.get('/:id', privilegeController.getPrivilege);
router.put('/:id', privilegeController.updatePrivilege);
router.delete('/:id', privilegeController.deletePrivilege);

// Helpers
router.get('/user/:userId', privilegeController.getPrivilegesByUser);
router.get('/section/:sectionId', privilegeController.getPrivilegesBySection);
router.get('/check', privilegeController.checkUserRoleInSection);

module.exports = router;