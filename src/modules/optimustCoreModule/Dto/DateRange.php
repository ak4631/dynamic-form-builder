<?php

namespace Optimust\Core\Dto;

use DateTime;

class DateRange
{
    private ?DateTime $fromDate;
    private ?DateTime $toDate;

    public function __construct(DateTime $fromDate = null, DateTime $toDate = null)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    /**
     * @return DateTime|null
     */
    public function getFromDate(): ?DateTime
    {
        return $this->fromDate;
    }

    /**
     * @param DateTime|null $fromDate
     */
    public function setFromDate(?DateTime $fromDate): void
    {
        $this->fromDate = $fromDate;
    }

    /**
     * @return DateTime|null
     */
    public function getToDate(): ?DateTime
    {
        return $this->toDate;
    }

    /**
     * @param DateTime|null $toDate
     */
    public function setToDate(?DateTime $toDate): void
    {
        $this->toDate = $toDate;
    }
}
