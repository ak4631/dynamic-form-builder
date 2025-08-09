<?php

namespace Optimust\Core\Menu;

use Optimust\Entity\MenuItem;
use Optimust\Entity\Screen;

class DetailedMenuItem
{
    private int $id;
    private string $menuTitle;
    private ?array $additionalParams = [];
    private ?string $module = null;
    private ?string $screen = null;

    /**
     * @var DetailedMenuItem[]
     */
    private array $childMenuItems = [];

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getMenuTitle(): string
    {
        return $this->menuTitle;
    }

    /**
     * @param string $menuTitle
     */
    public function setMenuTitle(string $menuTitle): void
    {
        $this->menuTitle = $menuTitle;
    }

    /**
     * @return array|null
     */
    public function getAdditionalParams(): ?array
    {
        return $this->additionalParams;
    }

    /**
     * @param array|null $additionalParams
     */
    public function setAdditionalParams(?array $additionalParams): void
    {
        $this->additionalParams = $additionalParams;
    }

    /**
     * @return string|null
     */
    public function getModule(): ?string
    {
        return $this->module;
    }

    /**
     * @param string|null $module
     */
    public function setModule(?string $module): void
    {
        $this->module = $module;
    }

    /**
     * @return string|null
     */
    public function getScreen(): ?string
    {
        return $this->screen;
    }

    /**
     * @param string|null $screen
     */
    public function setScreen(?string $screen): void
    {
        $this->screen = $screen;
    }

    /**
     * @param MenuItem $sidePanelMenuItem
     * @return static
     */
    public static function createFromMenuItem(MenuItem $sidePanelMenuItem): self
    {
        $menuItem = new DetailedMenuItem();
        $menuItem->setId($sidePanelMenuItem->getId());
        $menuItem->setMenuTitle($sidePanelMenuItem->getMenuTitle());
        $menuItem->setAdditionalParams($sidePanelMenuItem->getAdditionalParams());

        $screen = $sidePanelMenuItem->getScreen();
        if ($screen instanceof Screen) {
            $menuItem->setModule($screen->getModule()->getName());
            $menuItem->setScreen($screen->getActionUrl());
        }
        return $menuItem;
    }

    /**
     * @param DetailedMenuItem $childMenuItem
     */
    public function addChild(self $childMenuItem)
    {
        $this->childMenuItems[] = $childMenuItem;
    }

    /**
     * @return DetailedMenuItem[]
     */
    public function getChildMenuItems(): array
    {
        return $this->childMenuItems;
    }
}
