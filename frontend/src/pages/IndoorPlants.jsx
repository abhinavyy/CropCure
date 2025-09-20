import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global style reset to prevent external interference
const GlobalStyle = createGlobalStyle`
  .indoor-plants-container * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }
`;

// Animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

const spin = keyframes`
  to { 
    transform: rotate(360deg); 
  }
`;

// Styled components
const IndoorPlantsPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow-x: hidden;
  padding: 20px;
  
  /* Container class to scope all styles */
  &.indoor-plants-container {
    * {
      box-sizing: border-box;
    }
  }
`;

const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: ${float} 6s ease-in-out infinite;
  
  &.leaf-1 {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.leaf-2 {
    top: 25%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &.leaf-3 {
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
  
  &.leaf-4 {
    bottom: 30%;
    right: 10%;
    animation-delay: 1s;
  }
`;

const PlantsHero = styled.div`
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  h1 {
    font-size: 3rem;
    color: #2d5016;
    margin-top: 70px;
    margin-bottom: 15px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    color: #5a7d3c;
    max-width: 600px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
    }
  }
`;

const PlantsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 30px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
  transition: width 0.5s ease;
  width: ${props => props.width}%;
`;

const StepIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: -25px;
  
  @media (max-width: 768px) {
    margin-top: -20px;
  }
`;

const StepDot = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : '#e9ecef'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: 3px solid white;
  transition: all 0.3s ease;
  transform: ${props => props.active ? 'scale(1.1)' : 'scale(1)'};
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
`;

const FormWrapper = styled.div`
  text-align: center;
`;

const FormHeader = styled.div`
  h2 {
    font-size: 2rem;
    color: #2d5016;
    margin-bottom: 10px;
    
    @media (max-width: 480px) {
      font-size: 1.6rem;
    }
  }
  
  p {
    color: #6c757d;
    margin-bottom: 30px;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.div`
  background: white;
  border: 2px solid ${props => props.selected ? props.color : '#e9ecef'};
  border-radius: 15px;
  padding: 25px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${props => props.selected ? 
    `linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))` : 'white'};
  transform: ${props => props.selected ? 'translateY(-5px)' : 'translateY(0)'};
  box-shadow: ${props => props.selected ? '0 10px 25px rgba(76, 175, 80, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

const OptionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const OptionText = styled.div`
  font-weight: 600;
  color: #2d5016;
  
  small {
    display: block;
    font-weight: normal;
    color: #6c757d;
    margin-top: 5px;
    font-size: 0.9rem;
  }
`;

const FormNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavButton = styled.button`
  padding: 12px 25px;
  border: 2px solid #4CAF50;
  background: white;
  color: #4CAF50;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4CAF50;
    color: white;
  }
  
  &.prev-button {
    // Specific styles if needed
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SubmitButton = styled.button`
  padding: 15px 35px;
  background: ${props => props.disabled ? 
    'linear-gradient(135deg, #cccccc, #aaaaaa)' : 
    'linear-gradient(135deg, #4CAF50, #8BC34A)'};
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoadingSpinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const RecommendationsSection = styled.div`
  text-align: center;
`;

const ResultsHeader = styled.div`
  h2 {
    font-size: 2.2rem;
    color: #2d5016;
    margin-bottom: 10px;
  }
  
  p {
    color: #6c757d;
    margin-bottom: 40px;
  }
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TechniqueCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  border: 1px solid #e9ecef;
  color: #2d5016; /* Default text color */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-right: 15px;
`;

const CardTitle = styled.h3`
  color: #2d5016;
  margin: 0;
`;

const CardDescription = styled.p`
  color: #5a7d3c;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const BenefitsSection = styled.div`
  margin-bottom: 20px;
  
  h4 {
    color: #2d5016;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  
  ul {
    padding-left: 20px;
    margin: 0;
  }
  
  li {
    color: #5a7d3c;
    margin-bottom: 8px;
    line-height: 1.4;
    font-size: 0.95rem;
  }
`;

const BestForSection = styled.div`
  margin-bottom: 20px;
  
  h4 {
    color: #2d5016;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  
  p {
    color: #5a7d3c;
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
  }
`;

const RestartButton = styled.button`
  padding: 15px 35px;
  background: linear-gradient(135deg, #6c757d, #adb5bd);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(108, 117, 125, 0.3);
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px 20px;
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
`;

// Mock API function for demonstration
const mockApiCall = (userSelections) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response based on user selections
      const { plant_type, light_condition, experience_level, space_available } = userSelections;
      
      let recommendations = [];
      
      if (plant_type === 'herbs') {
        recommendations = [
          {
            technique: "Container Gardening",
            description: "Growing herbs in individual containers for better control over soil and moisture conditions.",
            benefits: [
              "Easy to move plants as needed",
              "Better pest and disease management",
              "Ideal for small spaces like windowsills"
            ],
            bestFor: "Beginner gardeners with limited space who want to grow fresh culinary herbs.",
            image: "🌿"
          },
          {
            technique: "Grow Light Setup",
            description: "Using artificial lighting to supplement or replace natural sunlight for optimal herb growth.",
            benefits: [
              "Year-round growing regardless of season",
              "Consistent light levels for healthy growth",
              "Flexibility in plant placement"
            ],
            bestFor: "Indoor gardeners with limited natural light or those wanting to maximize growth potential.",
            image: "💡"
          }
        ];
      } else if (plant_type === 'succulents') {
        recommendations = [
          {
            technique: "Terrarium Planting",
            description: "Creating a miniature ecosystem in a glass container for succulents and cacti.",
            benefits: [
              "Low maintenance requirements",
              "Decorative and visually appealing",
              "Creates ideal humidity conditions"
            ],
            bestFor: "Small spaces and those who want an attractive, low-maintenance plant display.",
            image: "🌵"
          }
        ];
      } else {
        // Default recommendations
        recommendations = [
          {
            technique: "Hydroponic System",
            description: "Growing plants in a nutrient-rich water solution without soil.",
            benefits: [
              "Faster growth and higher yields",
              "Water conservation",
              "No soil-borne diseases"
            ],
            bestFor: "Intermediate to expert gardeners interested in high-efficiency indoor growing.",
            image: "💧"
          },
          {
            technique: "Vertical Garden",
            description: "Utilizing vertical space to grow plants on walls or stacked containers.",
            benefits: [
              "Maximizes limited space",
              "Creates a living wall aesthetic",
              "Improves air circulation"
            ],
            bestFor: "Those with limited floor space who want to maximize their growing area.",
            image: "🌱"
          }
        ];
      }
      
      resolve({ recommendations });
    }, 1500);
  });
};

// Main Component
const IndoorPlants = () => {
  const [plantType, setPlantType] = useState('');
  const [lightCondition, setLightCondition] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [spaceAvailable, setSpaceAvailable] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const totalSteps = 4;

  const plantTypeOptions = [
    { value: 'leafy-greens', label: 'Leafy Greens', icon: '🥬', color: '#4CAF50' },
    { value: 'herbs', label: 'Herbs', icon: '🌿', color: '#8BC34A' },
    { value: 'succulents', label: 'Succulents', icon: '🌵', color: '#795548' },
    { value: 'flowering', label: 'Flowering Plants', icon: '🌸', color: '#E91E63' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥕', color: '#FF9800' },
    { value: 'other', label: 'Other/Mixed', icon: '🌱', color: '#9C27B0' },
  ];

  const lightConditionOptions = [
    { value: 'low', label: 'Low Light', icon: '🌙', color: '#607D8B' },
    { value: 'moderate', label: 'Moderate Light', icon: '🌤️', color: '#FFC107' },
    { value: 'bright', label: 'Bright Indirect', icon: '🔆', color: '#FF9800' },
    { value: 'direct', label: 'Direct Sunlight', icon: '☀️', color: '#FF5722' },
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', color: '#4CAF50' },
    { value: 'intermediate', label: 'Intermediate', icon: '🌿', color: '#2196F3' },
    { value: 'expert', label: 'Expert', icon: '🌳', color: '#673AB7' },
  ];

  const spaceAvailableOptions = [
    { value: 'small', label: 'Small Space', description: 'windowsill/shelf', icon: '📦', color: '#795548' },
    { value: 'medium', label: 'Medium Space', description: 'tabletop/stand', icon: '🖼️', color: '#607D8B' },
    { value: 'large', label: 'Large Space', description: 'dedicated room', icon: '🏡', color: '#3F51B5' },
  ];

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        setStep(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For demonstration, we'll use the mock API function
      const data = await mockApiCall({
        plant_type: plantType,
        light_condition: lightCondition,
        experience_level: experienceLevel,
        space_available: spaceAvailable,
      });
      
      setRecommendations(data.recommendations || []);
      setStep(5);
      
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (stepNumber) => {
    switch (stepNumber) {
      case 1: return "Choose Your Plant Type";
      case 2: return "Assess Light Conditions";
      case 3: return "Define Your Experience Level";
      case 4: return "Evaluate Available Space";
      default: return "";
    }
  };

  const getProgressPercentage = () => {
    return ((step - 1) / totalSteps) * 100;
  };

  return (
    <>
      <GlobalStyle />
      <IndoorPlantsPage className="indoor-plants-container">
        {/* Background Elements */}
        <BackgroundElements>
          <FloatingLeaf className="leaf-1">🍃</FloatingLeaf>
          <FloatingLeaf className="leaf-2">🌿</FloatingLeaf>
          <FloatingLeaf className="leaf-3">🌱</FloatingLeaf>
          <FloatingLeaf className="leaf-4">🍀</FloatingLeaf>
        </BackgroundElements>

        <PlantsHero>
          <HeroContent>
            <h1>🌿 Indoor Plant Advisor</h1>
            <p>Discover the perfect growing techniques for your indoor garden sanctuary</p>
          </HeroContent>
        </PlantsHero>
        
        <PlantsContainer>
          {/* Progress Bar */}
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill width={getProgressPercentage()} />
            </ProgressBar>
            <StepIndicators>
              {[1, 2, 3, 4].map((stepNum) => (
                <StepDot
                  key={stepNum}
                  active={step >= stepNum}
                >
                  {stepNum}
                </StepDot>
              ))}
            </StepIndicators>
          </ProgressContainer>

          {step <= 4 ? (
            <FormWrapper>
              <FormHeader>
                <h2>{getStepTitle(step)}</h2>
                <p>Step {step} of {totalSteps}</p>
              </FormHeader>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Plant Type */}
                {step === 1 && (
                  <OptionsGrid>
                    {plantTypeOptions.map(option => (
                      <OptionCard
                        key={option.value}
                        selected={plantType === option.value}
                        color={option.color}
                        onClick={() => {
                          setPlantType(option.value);
                          handleNextStep();
                        }}
                      >
                        <OptionIcon>{option.icon}</OptionIcon>
                        <OptionText>{option.label}</OptionText>
                      </OptionCard>
                    ))}
                  </OptionsGrid>
                )}

                {/* Step 2: Light Condition */}
                {step === 2 && (
                  <OptionsGrid>
                    {lightConditionOptions.map(option => (
                      <OptionCard
                        key={option.value}
                        selected={lightCondition === option.value}
                        color={option.color}
                        onClick={() => {
                          setLightCondition(option.value);
                          handleNextStep();
                        }}
                      >
                        <OptionIcon>{option.icon}</OptionIcon>
                        <OptionText>{option.label}</OptionText>
                      </OptionCard>
                    ))}
                  </OptionsGrid>
                )}

                {/* Step 3: Experience Level */}
                {step === 3 && (
                  <OptionsGrid>
                    {experienceLevelOptions.map(option => (
                      <OptionCard
                        key={option.value}
                        selected={experienceLevel === option.value}
                        color={option.color}
                        onClick={() => {
                          setExperienceLevel(option.value);
                          handleNextStep();
                        }}
                      >
                        <OptionIcon>{option.icon}</OptionIcon>
                        <OptionText>{option.label}</OptionText>
                      </OptionCard>
                    ))}
                  </OptionsGrid>
                )}

                {/* Step 4: Space Available */}
                {step === 4 && (
                  <OptionsGrid>
                    {spaceAvailableOptions.map(option => (
                      <OptionCard
                        key={option.value}
                        selected={spaceAvailable === option.value}
                        color={option.color}
                        onClick={() => setSpaceAvailable(option.value)}
                      >
                        <OptionIcon>{option.icon}</OptionIcon>
                        <OptionText>
                          <div>{option.label}</div>
                          <small>{option.description}</small>
                        </OptionText>
                      </OptionCard>
                    ))}
                  </OptionsGrid>
                )}

                <FormNavigation>
                  {step > 1 && (
                    <NavButton
                      type="button"
                      className="prev-button"
                      onClick={handlePreviousStep}
                    >
                      ← Previous
                    </NavButton>
                  )}
                  
                  {step === 4 && (
                    <SubmitButton
                      type="submit"
                      disabled={loading || !spaceAvailable}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          Generating Recommendations...
                        </>
                      ) : (
                        'Get Your Plant Guide 🌟'
                      )}
                    </SubmitButton>
                  )}
                </FormNavigation>
              </form>
            </FormWrapper>
          ) : (
            <RecommendationsSection>
              <ResultsHeader>
                <h2>✨ Your Personalized Plant Guide</h2>
                <p>Based on your unique indoor gardening setup</p>
              </ResultsHeader>
              
              <RecommendationsGrid>
                {recommendations.map((rec, index) => (
                  <TechniqueCard key={index}>
                    <CardHeader>
                      <CardIcon>{rec.image}</CardIcon>
                      <CardTitle>{rec.technique}</CardTitle>
                    </CardHeader>
                    <CardDescription>{rec.description}</CardDescription>
                    
                    <BenefitsSection>
                      <h4>🌱 Benefits</h4>
                      <ul>
                        {rec.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </BenefitsSection>
                    
                    <BestForSection>
                      <h4>🎯 Perfect For</h4>
                      <p>{rec.bestFor}</p>
                    </BestForSection>
                  </TechniqueCard>
                ))}
              </RecommendationsGrid>

              <RestartButton 
                onClick={() => {
                  setStep(1);
                  setPlantType('');
                  setLightCondition('');
                  setExperienceLevel('');
                  setSpaceAvailable('');
                  setRecommendations([]);
                }}
              >
                Start New Consultation 🔄
              </RestartButton>
            </RecommendationsSection>
          )}

          {error && (
            <ErrorMessage>
              <span>⚠️</span>
              {error}
            </ErrorMessage>
          )}
        </PlantsContainer>
      </IndoorPlantsPage>
    </>
  );
};

export default IndoorPlants;