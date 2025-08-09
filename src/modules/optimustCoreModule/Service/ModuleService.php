<?php

namespace Optimust\Core\Service;

use Optimust\Core\Dao\ModuleDao;
use Optimust\Entity\Module;

class ModuleService
{
    /**
     * @var ModuleDao|null
     */
    protected ?ModuleDao $moduleDao = null;

    /**
     * Get Module Dao
     * @return ModuleDao
     */
    public function getModuleDao(): ModuleDao
    {
        if (!$this->moduleDao instanceof ModuleDao) {
            $this->moduleDao = new ModuleDao();
        }

        return $this->moduleDao;
    }

    /**
     * Set Module Dao
     * @param ModuleDao $moduleDao
     */
    public function setModuleDao(ModuleDao $moduleDao): void
    {
        $this->moduleDao = $moduleDao;
    }

    /**
     * Get Module object collection from modules table
     *
     * @return Module[]
     */
    public function getModuleList(): array
    {
        return $this->getModuleDao()->getModuleList();
    }

    /**
     * Update Module Status
     * Accept a module array with key as module name and value as enabled status
     * $modules = ['leave' => 1, 'admin' => 0]
     *
     * @param array<string, bool> $modules
     * @return Module[]
     */
    public function updateModuleStatus(?array $modules): array
    {
        return $this->getModuleDao()->updateModuleStatus($modules);
    }
}
