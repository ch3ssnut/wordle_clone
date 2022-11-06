<?php

namespace App\Controller;

use App\Entity\Words;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DailyWordController extends AbstractController
{
    #[Route('/word', name: 'app_daily_word')]
    public function index(EntityManagerInterface $entityManagerInterface): Response
    {



        $repository = $entityManagerInterface->getRepository(Words::class);

        $oldWord = $repository->createQueryBuilder('w')
            ->andWhere('w.currentWord = TRUE')
            ->getQuery()
            ->getResult();


        if ($oldWord)
        {
            $oldWord[0]->setWasUsed(true);
            $oldWord[0]->setCurrentWord(false);
            $entityManagerInterface->flush();
        }

        $newWord = $repository->createQueryBuilder('w')
            ->andWhere('w.wasUsed is NULL')
            ->getQuery()
            ->setMaxResults(1)
            ->getResult();
        
        $newWord[0]->setCurrentWord(true);
        $entityManagerInterface->flush();

        

        return $this->redirectToRoute('app_default');
    }
}
