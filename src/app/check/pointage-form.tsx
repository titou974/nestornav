"use client";

import { Employee, ClockInAction, ClockIn } from "@/types/database";
import {
  Alert,
  Button,
  Form,
  Label,
  Select,
  ListBox,
  TextField,
  Spinner,
  Input,
  FieldError,
} from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createEmployeeAction,
  createClockInAction,
  getLastClockInAction,
  saveEmployeeCookieAction,
  getEmployeeCookieAction,
} from "@/app/actions/pointage";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import checkAnimation from "../../assets/Success.json";
import { PlayIcon, PauseIcon, StopIcon } from "@heroicons/react/24/solid";
import { FR_STRINGS } from "@/constants/fr.strings";

interface TokenData {
  siteId: string;
  siteName: string;
  tenantId: string;
  token: string;
  employees: Employee[];
}

interface PointageFormProps {
  tokenData: TokenData;
}

const actions = [
  {
    value: "START" as ClockInAction,
    label: FR_STRINGS.actions.start.label,
    description: FR_STRINGS.actions.start.description,
    icon: <PlayIcon className="w-4 h-4" />,
    variant: "primary" as const,
  },
  {
    value: "PAUSE" as ClockInAction,
    label: FR_STRINGS.actions.pause.label,
    description: FR_STRINGS.actions.pause.description,
    icon: <PauseIcon className="w-4 h-4" />,
    variant: "secondary" as const,
  },
  {
    value: "END" as ClockInAction,
    label: FR_STRINGS.actions.end.label,
    description: FR_STRINGS.actions.end.description,
    icon: <StopIcon className="w-4 h-4" />,
    variant: "danger" as const,
  },
];

export function PointageForm({
  tokenData: initialTokenData,
}: PointageFormProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const [error, setError] = useState<string | null>(null);
  const [successTitle, setSuccessTitle] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData>(initialTokenData);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [lastClockIn, setLastClockIn] = useState<ClockIn | null>(null);
  const [isLoadingLastClockIn, setIsLoadingLastClockIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] =
    useState<ClockInAction | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Formulaire nouvel employé
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const loadLastClockIn = async (employeeId: string) => {
    setIsLoadingLastClockIn(true);
    const result = await getLastClockInAction(employeeId, tokenData.siteId);
    if (result.success) {
      setLastClockIn(result.data || null);
    }
    setIsLoadingLastClockIn(false);
  };

  // Charger l'employé depuis le cookie au montage
  useEffect(() => {
    const loadEmployeeFromCookie = async () => {
      const result = await getEmployeeCookieAction();
      if (
        result.success &&
        result.data &&
        tokenData.employees.some((e) => e.id === result.data)
      ) {
        setSelectedEmployeeId(result.data);
      }
    };
    loadEmployeeFromCookie();
  }, [tokenData.employees]);

  // Charger le dernier pointage quand un employé est sélectionné
  useEffect(() => {
    if (selectedEmployeeId) {
      loadLastClockIn(selectedEmployeeId);
    } else {
      setLastClockIn(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployeeId]);

  const handleSelectEmployee = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setError(null);
    setSuccessTitle(null);
    setSuccessMessage(null);
    // Sauvegarder dans le cookie
    await saveEmployeeCookieAction(employeeId);
  };

  const handleCreateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tokenData || !firstName || !lastName) return;

    setIsLoading(true);
    setError(null);
    setSuccessTitle(null);
    setSuccessMessage(null);

    const result = await createEmployeeAction({
      firstName,
      lastName,
      tenantId: tokenData.tenantId,
    });

    if (!result.success) {
      setError(result.error || FR_STRINGS.error.createEmployee);
      setIsLoading(false);
      return;
    }

    // Ajouter le nouvel employé à la liste
    setTokenData({
      ...tokenData,
      employees: [...tokenData.employees, result.data!],
    });

    // Sélectionner automatiquement le nouvel employé
    setSelectedEmployeeId(result.data!.id);
    await saveEmployeeCookieAction(result.data!.id);

    // Réinitialiser le formulaire
    setFirstName("");
    setLastName("");
    setShowNewEmployeeForm(false);
    setIsLoading(false);
  };

  const handleSelectAction = async (action: ClockInAction) => {
    if (!selectedEmployeeId || !tokenData) return;

    setIsSubmitting(true);
    setSubmittingAction(action);
    setIsLoading(true);
    setError(null);
    setSuccessTitle(null);
    setSuccessMessage(null);

    const result = await createClockInAction({
      siteId: tokenData.siteId,
      employeeId: selectedEmployeeId,
      action,
      tenantId: tokenData.tenantId,
      token: tokenData.token,
    });

    if (result.success) {
      // Déterminer si c'est une reprise après pause
      const isResuming = action === "START" && lastClockIn?.action === "PAUSE";

      // Définir le titre et le message selon l'action
      if (action === "START") {
        if (isResuming) {
          setSuccessTitle("Travail repris");
          setSuccessMessage(
            "Vous avez repris votre travail après la pause. Pour réeffectuer une action, scannez le QR code.",
          );
        } else {
          setSuccessTitle("Travail commencé");
          setSuccessMessage(
            "Votre journée de travail a commencé. Pour réeffectuer une action, scannez le QR code.",
          );
        }
      } else if (action === "PAUSE") {
        setSuccessTitle("Travail en pause");
        setSuccessMessage(
          "Vous êtes en pause, bon repos ! Pour réeffectuer une action, scannez le QR code.",
        );
      } else if (action === "END") {
        setSuccessTitle("Travail terminé");
        setSuccessMessage(
          "Votre journée de travail est terminée, bon retour ! Pour réeffectuer une action, scannez le QR code.",
        );
      }

      // Recharger le dernier pointage
      await loadLastClockIn(selectedEmployeeId);

      setShowForm(false);
    } else {
      setError(result.error || FR_STRINGS.error.generic);
    }

    setIsLoading(false);
    setIsSubmitting(false);
    setSubmittingAction(null);
  };

  const isActionDisabled = (action: ClockInAction): boolean => {
    if (!lastClockIn) {
      // Pas de pointage précédent : seul START est autorisé
      return action !== "START";
    }

    // Si le dernier pointage est START, on peut faire PAUSE ou END
    if (lastClockIn.action === "START") {
      return action === "START";
    }

    // Si le dernier pointage est PAUSE, on peut faire START ou END
    if (lastClockIn.action === "PAUSE") {
      return action === "PAUSE";
    }

    // Si le dernier pointage est END, on peut seulement faire START
    if (lastClockIn.action === "END") {
      return action !== "START";
    }

    return false;
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInVariants}
            transition={{ duration: 0.3 }}
          >
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{FR_STRINGS.error.title}</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert>
          </motion.div>
        )}

        {successTitle && successMessage && (
          <motion.div
            key="success"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInVariants}
            transition={{ duration: 0.3 }}
          >
            <Alert status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{FR_STRINGS.success.title}</Alert.Title>
                <Alert.Description>
                  {FR_STRINGS.success.description}
                </Alert.Description>
              </Alert.Content>
            </Alert>
            <Lottie
              lottieRef={lottieRef}
              animationData={checkAnimation}
              className="w-40 h-40 mx-auto mt-10"
              autoPlay={true}
              loop={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire principal */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            key="form"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInVariants}
            transition={{ duration: 0.4 }}
            className="bg-[#111111] rounded-lg border border-border p-6 space-y-6"
          >
            {/* Sélection employé */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {FR_STRINGS.pointageForm.selectEmployee}
                </h2>
              </div>

              <Select
                name="employee"
                placeholder={FR_STRINGS.pointageForm.selectEmployeePlaceholder}
                value={selectedEmployeeId || undefined}
                onChange={async (value) => {
                  if (value) {
                    await handleSelectEmployee(value as string);
                  }
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox aria-label={FR_STRINGS.pointageForm.employees}>
                    {tokenData.employees.map((employee) => (
                      <ListBox.Item
                        key={employee.id}
                        id={employee.id}
                        textValue={`${employee.firstName} ${employee.lastName}`}
                      >
                        <Label>
                          {employee.firstName} {employee.lastName}
                        </Label>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {!showNewEmployeeForm && (
                <Button
                  variant="secondary"
                  fullWidth
                  onPress={() => setShowNewEmployeeForm(true)}
                >
                  {FR_STRINGS.pointageForm.newCollaborator}
                </Button>
              )}
            </div>

            {/* Formulaire nouvel employé */}
            {showNewEmployeeForm && (
              <div className="border-t border-border pt-6 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {FR_STRINGS.createEmployee.title}
                  </h2>
                  <p className="text-sm text-muted">
                    {FR_STRINGS.createEmployee.description}
                  </p>
                </div>

                <Form
                  className="flex flex-col gap-4"
                  onSubmit={handleCreateEmployee}
                >
                  <TextField
                    isRequired
                    name="firstName"
                    value={firstName}
                    onChange={setFirstName}
                  >
                    <Label>{FR_STRINGS.createEmployee.firstName}</Label>
                    <Input
                      placeholder={
                        FR_STRINGS.createEmployee.firstNamePlaceholder
                      }
                    />
                    <FieldError>
                      {FR_STRINGS.createEmployee.firstNameRequired}
                    </FieldError>
                  </TextField>

                  <TextField
                    isRequired
                    name="lastName"
                    value={lastName}
                    onChange={setLastName}
                  >
                    <Label>{FR_STRINGS.createEmployee.lastName}</Label>
                    <Input
                      placeholder={
                        FR_STRINGS.createEmployee.lastNamePlaceholder
                      }
                    />
                    <FieldError>
                      {FR_STRINGS.createEmployee.lastNameRequired}
                    </FieldError>
                  </TextField>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isPending={isLoading}
                      isDisabled={!firstName || !lastName}
                    >
                      {FR_STRINGS.createEmployee.create}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onPress={() => {
                        setShowNewEmployeeForm(false);
                        setFirstName("");
                        setLastName("");
                      }}
                      isDisabled={isLoading}
                    >
                      {FR_STRINGS.createEmployee.cancel}
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {/* Actions de pointage */}
            {selectedEmployeeId && !showNewEmployeeForm && (
              <div className="border-t border-border pt-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    {FR_STRINGS.pointageForm.title}
                  </h2>
                  {lastClockIn && (
                    <p className="text-xs text-muted">
                      {FR_STRINGS.pointageForm.lastAction} :{" "}
                      {lastClockIn.action === "START"
                        ? "Début"
                        : lastClockIn.action === "PAUSE"
                          ? "Pause"
                          : "Fin"}
                      {" le "}
                      {new Date(lastClockIn.timestamp).toLocaleString("fr-FR")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 items-center mt-8">
                  {actions.map((action) => {
                    // Modifier le libellé du bouton START si le dernier pointage est PAUSE
                    const isResuming =
                      action.value === "START" &&
                      lastClockIn?.action === "PAUSE";
                    const label = isResuming
                      ? FR_STRINGS.actions.resume.label
                      : action.label;
                    const description = isResuming
                      ? FR_STRINGS.actions.resume.description
                      : action.description;

                    return (
                      <Button
                        key={action.value}
                        variant={action.variant}
                        className="w-full"
                        isDisabled={
                          isLoading ||
                          isLoadingLastClockIn ||
                          isActionDisabled(action.value)
                        }
                        isPending={
                          isSubmitting && submittingAction === action.value
                        }
                        onPress={() => handleSelectAction(action.value)}
                      >
                        {({ isPending }) => (
                          <>
                            {isPending ? (
                              <Spinner color="current" size="sm" />
                            ) : (
                              <span className="">{action.icon}</span>
                            )}
                            <span className="font-semibold">{label}</span>
                            <span className="opacity-80">
                              {isPending ? "En cours..." : description}
                            </span>
                          </>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
