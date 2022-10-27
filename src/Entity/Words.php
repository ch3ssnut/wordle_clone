<?php

namespace App\Entity;

use App\Repository\WordsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WordsRepository::class)]
class Words
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 5)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?bool $wasUsed = null;

    #[ORM\Column(nullable: true)]
    private ?bool $currentWord = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function isWasUsed(): ?bool
    {
        return $this->wasUsed;
    }

    public function setWasUsed(?bool $wasUsed): self
    {
        $this->wasUsed = $wasUsed;

        return $this;
    }

    public function isCurrentWord(): ?bool
    {
        return $this->currentWord;
    }

    public function setCurrentWord(?bool $currentWord): self
    {
        $this->currentWord = $currentWord;

        return $this;
    }
}
