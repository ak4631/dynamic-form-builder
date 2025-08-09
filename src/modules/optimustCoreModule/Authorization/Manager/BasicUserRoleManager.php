<?php

namespace Optimust\Core\Authorization\Manager;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Authorization\Dao\HomePageDao;
use Optimust\Core\Authorization\Dto\DataGroupPermissionCollection;
use Optimust\Core\Authorization\Dto\DataGroupPermissionFilterParams;
use Optimust\Core\Authorization\Dto\ResourcePermission;
use Optimust\Core\Authorization\Exception\AuthorizationException;
use Optimust\Core\Authorization\Service\DataGroupService;
use Optimust\Core\Authorization\Service\ScreenPermissionService;
use Optimust\Core\Authorization\UserRole\AbstractUserRole;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\HomePage\HomePageEnablerInterface;
use Optimust\Core\Service\AccessFlowStateMachineService;
use Optimust\Core\Service\MenuService;
use Optimust\Core\Traits\ClassHelperTrait;
use Optimust\Core\Traits\Service\MenuServiceTrait;
use Optimust\Entity\User;
use Optimust\Entity\UserRole;
use Optimust\Entity\WorkflowStateMachine;

class BasicUserRoleManager extends AbstractUserRoleManager
{
    use ClassHelperTrait;
    use UserServiceTrait;
    use MenuServiceTrait;

    public const PERMISSION_TYPE_DATA_GROUP = 'data_group';
    public const PERMISSION_TYPE_ACTION = 'action';
    public const PERMISSION_TYPE_WORKFLOW_ACTION = 'workflow_action';
    public const PERMISSION_TYPE_USER_ROLE_SPECIFIC = 'user_role_specific';

    public const OPERATION_VIEW = 'view';
    public const OPERATION_EDIT = 'edit';
    public const OPERATION_DELETE = 'delete';

    protected ?ScreenPermissionService $screenPermissionService = null;
    protected ?DataGroupService $dataGroupService = null;
    protected $subordinates = null;
    protected ?MenuService $menuService = null;
    protected ?HomePageDao $homePageDao = null;
    protected ?AccessFlowStateMachineService $accessFlowStateMachineService = null;

    /**
     * @var AbstractUserRole[]
     */
    protected array $userRoleClasses = [];

    public function __construct()
    {
        $this->_init();
    }

    private function _init(): void
    {
        // TODO:: move to yaml or database
        $configurations = [];

        foreach ($configurations as $roleName => $roleObj) {
            $className = $this->getClassHelper()->getClass(
                $roleObj['class'],
                'Optimust\\Core\\Authorization\\UserRole\\'
            );
            $this->userRoleClasses[$roleName] = new $className($roleName, $this);
        }
    }

    /**
     * @param string $roleName
     * @return AbstractUserRole|null
     */
    protected function getUserRoleClass(string $roleName): ?AbstractUserRole
    {
        return $this->userRoleClasses[$roleName] ?? null;
    }

    /**
     * @return ScreenPermissionService
     */
    protected function getScreenPermissionService(): ScreenPermissionService
    {
        if (!$this->screenPermissionService instanceof ScreenPermissionService) {
            $this->screenPermissionService = new ScreenPermissionService();
        }
        return $this->screenPermissionService;
    }

    /**
     * @param ScreenPermissionService $screenPermissionService
     */
    public function setScreenPermissionService(ScreenPermissionService $screenPermissionService): void
    {
        $this->screenPermissionService = $screenPermissionService;
    }

    /**
     * @return HomePageDao
     */
    protected function getHomePageDao(): HomePageDao
    {
        if (!$this->homePageDao instanceof HomePageDao) {
            $this->homePageDao = new HomePageDao();
        }
        return $this->homePageDao;
    }

    /**
     * @param HomePageDao $homePageDao
     */
    public function setHomePageDao(HomePageDao $homePageDao): void
    {
        $this->homePageDao = $homePageDao;
    }

    /**
     * @return AccessFlowStateMachineService
     */
    protected function getAccessFlowStateMachineService(): AccessFlowStateMachineService
    {
        if (!$this->accessFlowStateMachineService instanceof AccessFlowStateMachineService) {
            $this->accessFlowStateMachineService = new AccessFlowStateMachineService();
        }
        return $this->accessFlowStateMachineService;
    }

    /**
     * @inheritDoc
     */
    public function getAccessibleEntityProperties(
        string $entityType,
        array $properties = [],
        ?string $orderField = null,
        ?string $orderBy = null,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $requiredPermissions = []
    ): array {
        // TODO
        throw AuthorizationException::methodNotImplemented(__METHOD__);

        $allPropertyList = [];
        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude);

        foreach ($filteredRoles as $role) {
            $propertyList = [];

            $roleClass = $this->getUserRoleClass($role->getName());

        }

        return $allPropertyList;
    }

    /**
     * TODO: 'locations', 'system users', 'operational countries',
     *       'user role' (only ess for regional admin),
     *
     * @param string $entityType
     * @param string|null $operation
     * @param null $returnType
     * @param string[] $rolesToExclude
     * @param string[] $rolesToInclude
     * @param array $requiredPermissions
     * @return int[]
     */
    public function getAccessibleEntityIds(
        string $entityType,
        ?string $operation = null,
        $returnType = null,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $requiredPermissions = []
    ): array {
        // TODO
        $allIds = [];
        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude);

        foreach ($filteredRoles as $role) {
            $ids = [];
            $roleClass = $this->getUserRoleClass($role->getName());

            if ($roleClass) {
                $ids = $roleClass->getAccessibleEntityIds($entityType, $operation, $returnType, $requiredPermissions);
            }

            if (count($ids) > 0) {
                $allIds = array_unique(array_merge($allIds, $ids));
            }
        }

        return $allIds;
    }

    /**
     * Check State Transition possible for User
     *
     * @param string $workFlowId
     * @param string $state
     * @param string $action
     * @param array $rolesToExclude
     * @param array $rolesToInclude
     * @param array $entities
     * @return bool
     */
    public function isActionAllowed(
        string $workFlowId,
        string $state,
        string $action,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $entities = []
    ): bool {
        $isAllowed = false;

        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude, $entities);

        foreach ($filteredRoles as $role) {
            $roleName = $this->fixUserRoleNameForWorkflowStateMachine($role->getName(), $workFlowId);

            $isAllowed = $this->getAccessFlowStateMachineService()->isActionAllowed(
                $workFlowId,
                $state,
                $roleName,
                $action
            );
            if ($isAllowed) {
                break;
            }
        }
        return $isAllowed;
    }

    /**
     * Get allowed Workflow action items for User
     *
     * @param string $workflow Workflow Name
     * @param string $state Workflow state
     * @param array $rolesToExclude
     * @param array $rolesToInclude
     * @param array $entities
     * @return array|WorkflowStateMachine[] Array of workflow items with action name as array index
     */
    public function getAllowedActions(
        string $workflow,
        string $state,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $entities = []
    ): array {
        $allActions = [];

        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude, $entities);
        //print_r($filteredRoles);

        foreach ($filteredRoles as $role) {
            $roleName = $this->fixUserRoleNameForWorkflowStateMachine($role->getName(), $workflow);
            $workFlowItems = $this->getAccessFlowStateMachineService()->getAllowedWorkflowItems(
                $workflow,
                $state,
                $roleName
            );

            if (count($workFlowItems) > 0) {
                $allActions = $this->getUniqueActionsBasedOnPriority($allActions, $workFlowItems);
            }
        }
        return $allActions;
    }

    /**
     * Given an array of actions, returns the states for which those actions can be applied
     * by the current logged in user
     *
     * @param string $workflow Workflow
     * @param array $actions Array of Action names
     * @param array $rolesToExclude
     * @param array $rolesToInclude
     * @param array $entities
     *
     * @return array Array of states
     */
    public function getActionableStates(
        string $workflow,
        array $actions,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $entities = []
    ): array {
        $actionableStates = [];

        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude, $entities);

        foreach ($filteredRoles as $role) {
            $roleName = $this->fixUserRoleNameForWorkflowStateMachine($role->getName(), $workflow);
            $states = $this->getAccessFlowStateMachineService()->getActionableStates($workflow, $roleName, $actions);

            if (!empty($states)) {
                $actionableStates = array_unique(array_merge($actionableStates, $states));
            }
        }
        return $actionableStates;
    }

    /**
     * @param WorkflowStateMachine[] $currentItems
     * @param WorkflowStateMachine[] $itemsToMerge
     * @return WorkflowStateMachine[]
     */
    protected function getUniqueActionsBasedOnPriority(array $currentItems, array $itemsToMerge): array
    {
        foreach ($itemsToMerge as $item) {
            $actionName = $item->getAction();
            if (!isset($currentItems[$actionName])) {
                $currentItems[$actionName] = $item;
            } else {
                $existing = $currentItems[$actionName];

                if ($item->getPriority() > $existing->getPriority()) {
                    $currentItems[$actionName] = $item;
                }
            }
        }

        return $currentItems;
    }

    /**
     * @inheritDoc
     */
    public function isEntityAccessible(
        string $entityType,
        $entityId,
        ?string $operation = null,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $requiredPermissions = []
    ): bool {
        // TODO
        $entityIds = $this->getAccessibleEntityIds(
            $entityType,
            $operation,
            null,
            $rolesToExclude,
            $rolesToInclude,
            $requiredPermissions
        );

        $accessible = in_array($entityId, $entityIds);

        return $accessible;
    }

    /**
     * @inheritDoc
     */
    public function areEntitiesAccessible(
        string $entityType,
        array $entityIds,
        ?string $operation = null,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $requiredPermissions = []
    ): bool {
        // TODO
        $accessibleIds = $this->getAccessibleEntityIds(
            $entityType,
            $operation,
            null,
            $rolesToExclude,
            $rolesToInclude,
            $requiredPermissions
        );

        $intersection = array_intersect($accessibleIds, $entityIds);

        $accessible = false;

        if (count($entityIds) == count($intersection)) {
            $diff = array_diff($entityIds, $intersection);
            if (count($diff) == 0) {
                $accessible = true;
            }
        }

        return $accessible;
    }


    /**
     * @inheritDoc
     * @throws AuthorizationException
     */
    public function getAccessibleModules(): array
    {
        throw AuthorizationException::methodNotImplemented(__METHOD__);
    }

    /**
     * @inheritDoc
     * @throws AuthorizationException
     */
    public function isModuleAccessible(string $module): bool
    {
        throw AuthorizationException::methodNotImplemented(__METHOD__);
    }

    /**
     * @inheritDoc
     * @throws AuthorizationException
     */
    public function isScreenAccessible(string $module, string $screen, string $field): bool
    {
        throw AuthorizationException::methodNotImplemented(__METHOD__);
    }

    /**
     * @inheritDoc
     * @throws AuthorizationException
     */
    public function isFieldAccessible(string $module, string $screen, string $field): bool
    {
        throw AuthorizationException::methodNotImplemented(__METHOD__);
    }

    /**
     * @inheritDoc
     */
    public function getScreenPermissions(string $module, string $screen): ResourcePermission
    {
        return $this->getScreenPermissionService()->getScreenPermissions($module, $screen, $this->userRoles);
    }

    /**
     * @inheritDoc
     */
    public function getApiPermissions(string $apiClassName): ResourcePermission
    {
        return $this->getDataGroupService()->getApiPermissions($apiClassName, $this->userRoles);
    }

    /**
     * @inheritDoc
     */
    protected function computeUserRoles(User $user): array
    {
        $roles = [$user->getUserRole()];

        return $roles;
    }

    /**
     * @param UserRole $role
     * @param array $requiredPermissions
     * @return bool
     * @throws DaoException
     */
    protected function areRequiredPermissionsAvailable(UserRole $role, array $requiredPermissions = []): bool
    {
        // TODO
        $permitted = true;

        foreach ($requiredPermissions as $permissionType => $permissions) {
            if ($permissionType == self::PERMISSION_TYPE_DATA_GROUP) {
                foreach ($permissions as $dataGroupName => $requestedResourcePermission) {
                    $dataGroupPermissions = $this->getDataGroupPermissions($dataGroupName, [], [$role->getName()]);

                    if ($permitted && $requestedResourcePermission->canRead()) {
                        $permitted = $permitted && $dataGroupPermissions->canRead();
                    }

                    if ($permitted && $requestedResourcePermission->canCreate()) {
                        $permitted = $dataGroupPermissions->canCreate();
                    }

                    if ($permitted && $requestedResourcePermission->canUpdate()) {
                        $permitted = $dataGroupPermissions->canUpdate();
                    }

                    if ($permitted && $requestedResourcePermission->canDelete()) {
                        $permitted = $dataGroupPermissions->canDelete();
                    }
                }
            }
        }

        return $permitted;
    }

    /**
     * Filter the given $userRoles array according to the given parameters
     *
     * @param UserRole[] $userRoles Array of UserRole objects
     * @param string[] $rolesToExclude Array of User role names to exclude. These user roles will be removed from $userRoles
     * @param string[] $rolesToInclude Array of User role names to include. If not empty, only these user roles will be included.
     * @param array $entities Array of details relevant to deciding if a particular user role applies to this
     * @return UserRole[] $userRoles array filtered as described above.
     */
    protected function filterRoles(
        array $userRoles,
        array $rolesToExclude,
        array $rolesToInclude,
        array $entities = []
    ): array {
        if (!empty($rolesToExclude)) {
            $temp = [];

            foreach ($userRoles as $role) {
                if (!in_array($role->getName(), $rolesToExclude)) {
                    $temp[] = $role;
                }
            }

            $userRoles = $temp;
        }

        if (!empty($rolesToInclude)) {
            $temp = [];

            foreach ($userRoles as $role) {
                if (in_array($role->getName(), $rolesToInclude)) {
                    $temp[] = $role;
                }
            }

            $userRoles = $temp;
        }

        $temp = [];

        if (!empty($entities)) {
            foreach ($userRoles as $role) {
                $include = true;

                if ($include) {
                    $temp[] = $role;
                }
            }

            $userRoles = $temp;
        }

        return $userRoles;
    }

    /**
     * @return DataGroupService
     */
    protected function getDataGroupService(): DataGroupService
    {
        if (!$this->dataGroupService instanceof DataGroupService) {
            $this->dataGroupService = new DataGroupService();
        }
        return $this->dataGroupService;
    }

    /**
     * @inheritDoc
     */
    public function getDataGroupPermissions(
        $dataGroupName,
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        bool $selfPermission = false,
        array $entities = []
    ): ResourcePermission {
        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude, $entities);

        $resourcePermission = new ResourcePermission(false, false, false, false);

        foreach ($filteredRoles as $role) {
            $userRoleId = $role->getId();
            // TODO:: improve fetch matching data groups using single query
            $permissions = $this->getDataGroupService()->getDataGroupPermission(
                $dataGroupName,
                $userRoleId,
                $selfPermission
            );

            foreach ($permissions as $permission) {
                $resourcePermission = $resourcePermission->orWith(
                    ResourcePermission::createFromDataGroupPermission($permission)
                );
            }
        }

        return $resourcePermission;
    }

    /**
     * @inheritDoc
     */
    public function getDataGroupPermissionCollection(
        DataGroupPermissionFilterParams $dataGroupPermissionFilterParams = null
    ): DataGroupPermissionCollection {
        $dataGroupPermissionFilterParams = $dataGroupPermissionFilterParams ?? new DataGroupPermissionFilterParams();
        $filteredRoles = $this->filterRoles(
            $this->userRoles,
            $dataGroupPermissionFilterParams->getRolesToExclude(),
            $dataGroupPermissionFilterParams->getRolesToInclude(),
            $dataGroupPermissionFilterParams->getEntities()
        );
        $dataGroupPermissionFilterParams->setUserRoles($filteredRoles);
        return $this->getDataGroupService()->getDataGroupPermissionCollection($dataGroupPermissionFilterParams);
    }

    public function getModuleDefaultPage(string $module): ?string
    {
        $action = null;

        $userRoleIds = [];
        foreach ($this->userRoles as $role) {
            $userRoleIds[] = $role->getId();
        }
        $defaultPages = $this->getHomePageDao()->getModuleDefaultPagesInPriorityOrder($module, $userRoleIds);

        foreach ($defaultPages as $defaultPage) {
            $enabled = true;
            $enableClass = $defaultPage->getEnableClass();
            $fallbackNamespace = 'Optimust\\Core\\HomePage\\';

            if (!empty($enableClass) && $this->getClassHelper()->classExists($enableClass, $fallbackNamespace)) {
                $enableClass = $this->getClassHelper()->getClass($enableClass, $fallbackNamespace);
                $enableClassInstance = new $enableClass();
                if ($enableClassInstance instanceof HomePageEnablerInterface) {
                    $enabled = $enableClassInstance->isEnabled($this->getUser());
                }
            }

            if ($enabled) {
                $action = $defaultPage->getAction();
                break;
            }
        }

        return $action;
    }

    public function getHomePage(): ?string
    {
        $action = null;

        $userRoleIds = [];
        foreach ($this->userRoles as $role) {
            $userRoleIds[] = $role->getId();
        }
        $defaultPages = $this->getHomePageDao()->getHomePagesInPriorityOrder($userRoleIds);

        foreach ($defaultPages as $defaultPage) {
            $enabled = true;
            $enableClass = $defaultPage->getEnableClass();
            $fallbackNamespace = 'Optimust\\Core\\HomePage\\';

            if (!empty($enableClass) && $this->getClassHelper()->classExists($enableClass, $fallbackNamespace)) {
                $enableClass = $this->getClassHelper()->getClass($enableClass, $fallbackNamespace);
                $enableClassInstance = new $enableClass();
                if ($enableClassInstance instanceof HomePageEnablerInterface) {
                    $enabled = $enableClassInstance->isEnabled($this->getUser());
                }
            }
            if ($enabled) {
                $action = $defaultPage->getAction();
                break;
            }
        }

        return $action;
    }

    /**
     * @param string $roleName
     * @param string $workflow
     * @return string
     * @todo fix this in `workflow_state_machine`
     */
    protected function fixUserRoleNameForWorkflowStateMachine(string $roleName, string $workflow): string
    {
        $fixedName = $roleName;

        return $fixedName;
    }

    /**
     * Returns an array of accessible quick launch items
     * e.g. - ['leave.leave_list', 'leave.my_leave', 'time.my_timesheet']
     *
     * @param string[] $rolesToExclude
     * @param string[] $rolesToInclude
     * @param array $requiredPermissions
     * @return string[]
     */
    public function getAccessibleQuickLaunchList(
        array $rolesToExclude = [],
        array $rolesToInclude = [],
        array $requiredPermissions = []
    ): array {
        $quickLaunchList = [];
        $filteredRoles = $this->filterRoles($this->userRoles, $rolesToExclude, $rolesToInclude);

        foreach ($filteredRoles as $role) {
            $shortcuts = [];
            $roleClass = $this->getUserRoleClass($role->getName());

            if ($roleClass) {
                $shortcuts = $roleClass->getAccessibleQuickLaunchList($requiredPermissions);
            }

            if (count($shortcuts) > 0) {
                $quickLaunchList = array_unique(array_merge($quickLaunchList, $shortcuts));
            }
        }

        return $quickLaunchList;
    }
}
