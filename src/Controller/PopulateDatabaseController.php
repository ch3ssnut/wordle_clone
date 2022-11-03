<?php

namespace App\Controller;

use App\Entity\Words;
use App\Service\AllWords;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PopulateDatabaseController extends AbstractController
{
    // #[Route('/populate', name: 'app_populate_database')]
    public function index(EntityManagerInterface $entityManagerInterface, AllWords $allWords): Response
    {


        set_time_limit(0);
        $i = 0;
        $wordArr = $allWords->getAllWords();
        shuffle($wordArr);
        foreach($allWords as $m) {
            $word = new Words();
            $word->setName($m);
            $entityManagerInterface->persist($word);
            $i++;
            if (( $i % 100) === 0) {
                $entityManagerInterface->flush();
                $entityManagerInterface->clear();
            }
        }
        $entityManagerInterface->flush();
        $entityManagerInterface->clear();


        $repo = $entityManagerInterface->getRepository(Words::class);
        dd($repo->findOneBy(['name' => 'cadgy']));
        
        $query = $entityManagerInterface->createQuery('DELETE FROM App\Entity\Words e')
            ->execute();
        return $this->redirectToRoute('app_default');
    }
}
