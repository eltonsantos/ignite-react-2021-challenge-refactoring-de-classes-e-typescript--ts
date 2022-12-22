import { useEffect, useState } from "react";
import { Food } from "../../components/Food";
import { Header } from "../../components/Header";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

export function Dashboard() {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFood() {
      const response = await api.get("/foods");
      setFoods(response.data);
    }
    loadFood();
  }, []);

  const handleAddFood = async (
    food: Omit<IFoodPlate, "id" | "avaliable">
  ): Promise<void> => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (
    food: Omit<IFoodPlate, "id" | "avaliable">
  ): Promise<void> => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      setFoods(
        foods.map((f) => (f.id !== foodUpdated.data.id ? f : foodUpdated.data))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number): Promise<void> => {
    try {
      await api.delete(`/foods/${id}`);
      setFoods(foods.filter((food) => food.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFoodPlate): void => {
    setEditingFood(food);
    toggleEditModal();
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
