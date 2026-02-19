import {
  Button,
  Input,
  Badge,
  Tag,
  RadioButton,
  Checkbox,
  Card,
  NavBar,
  TabItem,
  TabBar,
  MealCard,
  MealScheduleCard,
} from './design-system';
import './App.css';

function App() {
  return (
    <div className="app">
      <NavBar
        title="MealDesk"
        left={<div style={{ width: 32, height: 32, background: 'var(--color-primary-500)', borderRadius: 8 }} />}
      />

      <main className="showcase">
        <section className="section">
          <h2 className="section-title">Buttons</h2>
          <div className="row">
            <Button variant="primary">Sign In</Button>
          </div>
          <div className="row">
            <Button variant="secondary">Submit Selection</Button>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Inputs</h2>
          <Input placeholder="Enter your email" />
          <Input variant="password" placeholder="Enter your password" />
        </section>

        <section className="section">
          <h2 className="section-title">Badges &amp; Tags</h2>
          <div className="row-inline">
            <Badge variant="open">OPEN</Badge>
            <Badge variant="pending">PENDING</Badge>
            <Badge variant="closed">CLOSED</Badge>
          </div>
          <div className="row-inline" style={{ marginTop: 8 }}>
            <Tag>HIGH PROTEIN</Tag>
            <Tag>LOW CARB</Tag>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Form Controls</h2>
          <div className="row-inline">
            <RadioButton name="meal" label="Breakfast" defaultChecked />
            <RadioButton name="meal" label="Lunch" />
            <RadioButton name="meal" label="Dinner" />
          </div>
          <div className="row-inline">
            <Checkbox label="Vegetarian" />
            <Checkbox label="Halal" defaultChecked />
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Tabs</h2>
          <TabBar>
            <TabItem active>This Week</TabItem>
            <TabItem>Next Week</TabItem>
          </TabBar>
        </section>

        <section className="section">
          <h2 className="section-title">Cards</h2>
          <Card>
            <p>Basic card container</p>
          </Card>
        </section>

        <section className="section">
          <h2 className="section-title">Meal Cards</h2>
          <MealCard
            name="Grilled Chicken Bowl"
            description="Tender grilled chicken with quinoa, roasted vegetables and tahini dressing"
            tags={['HIGH PROTEIN', 'GLUTEN FREE']}
          />
          <MealCard
            name="Mediterranean Pasta"
            description="Penne with sun-dried tomatoes, olives, feta cheese and basil pesto"
            tags={['VEGETARIAN']}
          />
        </section>

        <section className="section">
          <h2 className="section-title">Meal Schedule</h2>
          <MealScheduleCard mealName="Grilled Chicken Bowl" date="Monday, Feb 17" deadline="Order by 10:00 AM" status="open" />
          <MealScheduleCard mealName="Mediterranean Pasta" date="Tuesday, Feb 18" deadline="Order by 10:00 AM" status="pending" />
          <MealScheduleCard mealName="Caesar Salad" date="Wednesday, Feb 19" deadline="Order by 10:00 AM" status="closed" />
        </section>
      </main>
    </div>
  );
}

export default App;
