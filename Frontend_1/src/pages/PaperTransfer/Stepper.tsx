import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface StepperProps {
  currentStep: number;
  steps: { id: number; name: string; icon: any }[];
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Icon */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.id
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > step.id ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={step.icon} />
            )}
          </div>

          {/* Step Name */}
          <div
            className={`ml-2 ${
              currentStep >= step.id ? 'text-primary' : 'text-gray-500'
            }`}
          >
            {step.name}
          </div>

          {/* Connector Line (Hidden on Mobile) */}
          {index < steps.length - 1 && (
            <div
              className={`hidden md:block flex-auto border-t-2 transition duration-500 ease-in-out ${
                currentStep > step.id ? 'border-primary' : 'border-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;