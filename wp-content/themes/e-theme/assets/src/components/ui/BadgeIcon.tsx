interface BadgeIconProps {
  icon: string;
  className?: string;
  hideBoxShadow?: boolean;
}

const badgeIconStyles = {
  background:
    "linear-gradient(0deg, rgba(109, 7, 74, 0.08), rgba(109, 7, 74, 0.08)), radial-gradient(36.67% 36.67% at 50% 50%, rgba(94, 21, 69, 0.16) 0%, rgba(255, 33, 178, 0) 100%)",
  border: "1px solid #FFFFFF0F",
  backdropFilter: "blur(112.4000015258789px)",
  boxShadow: "0px 4px 117px 0px #FF21B2E0",
};

const BadgeIcon = ({ icon, className = "", hideBoxShadow = false }: BadgeIconProps) => {
  const styles = {
    ...badgeIconStyles,
    ...(hideBoxShadow && { boxShadow: "none" }),
  };

  return (
    <div
      style={styles}
      className={`size-[75px] z-10 flex items-center justify-center rounded-full ${className}`}
    >
      <img src={icon} alt="" />
    </div>
  );
};

export default BadgeIcon;
